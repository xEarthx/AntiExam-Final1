import express from "express";
import cors from "cors";
import conn from "./db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

conn.connect(err => {
  if (err) console.error('❌ Connect error:', err);
  else console.log('✅ Connected to MariaDB');
});

// 🔐 Auth
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });

  conn.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length > 0)
        res.json({ message: 'เข้าสู่ระบบสำเร็จ', user: results[0] });
      else
        res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
  );
});

app.post('/register', (req, res) => {
  const { username, password, name, lname, email } = req.body;
  if (!username || !password || !name || !lname || !email)
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

  conn.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
      if (results.length > 0)
        return res.status(400).json({ message: 'Username หรือ Email นี้ถูกใช้งานแล้ว' });

      conn.query(
        'INSERT INTO users (username, password, name, lname, email, role) VALUES (?, ?, ?, ?, ?, ?)',
        [username, password, name, lname, email, 'user'],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'สมัครไม่สำเร็จ' });
          res.json({ message: 'สมัครสมาชิกสำเร็จ!' });
        }
      );
    }
  );
});

// 👨‍🏫 ห้องเรียน
app.post('/createclass', (req, res) => {
  const { name, room_id, description, user_id } = req.body;
  if (!name || !room_id || !description || !user_id)
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });

  conn.query('SELECT * FROM classroom WHERE room_id = ?', [room_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    if (results.length > 0)
      return res.status(400).json({ message: 'Room ID นี้มีอยู่แล้ว' });

    conn.query(
      'INSERT INTO classroom (name, room_id, description, user_id) VALUES (?, ?, ?, ?)',
      [name, room_id, description, user_id],
      (err2, result) => {
        if (err2) return res.status(500).json({ message: 'สร้างห้องไม่สำเร็จ' });

        const classroomId = result.insertId;
        conn.query(
          'INSERT INTO classroom_member (classroom_id, user_id) VALUES (?, ?)',
          [classroomId, user_id],
          (err3) => {
            if (err3) return res.status(500).json({ message: 'เพิ่มสมาชิกไม่สำเร็จ' });
            res.json({ message: 'สร้างห้องเรียนสำเร็จ!', classroom_id: classroomId });
          }
        );
      }
    );
  });
});

app.get('/myclassroom/:user_id', (req, res) => {
  const sql = `
    SELECT 
      c.*, 
      u.name AS creator_name, 
      u.id AS creator_id 
    FROM classroom c 
    JOIN users u ON u.id = c.user_id 
    WHERE c.user_id = ?
  `;

  conn.query(sql, [req.params.user_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' });
    res.json(result);
  });
});

app.get('/classroom/:id', (req, res) => {
  conn.query(
    'SELECT * FROM classroom WHERE classroom_id = ?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length === 0) return res.status(404).json({ message: 'ไม่พบห้อง' });
      res.json(result[0]);
    }
  );
});

app.get('/findroom/:room_id', (req, res) => {
  const sql = `
    SELECT 
      c.*, 
      u.name AS creator_name, 
      u.id AS creator_id 
    FROM classroom c 
    JOIN users u ON u.id = c.user_id 
    WHERE c.room_id = ?
  `;

  conn.query(sql, [req.params.room_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    if (result.length === 0) return res.status(404).json({ message: 'ไม่พบห้องเรียน' });
    res.json(result[0]);
  });
});

app.delete('/deleteclassroom/:id', (req, res) => {
  const classroomId = req.params.id;

  conn.query('DELETE FROM classroom_member WHERE classroom_id = ?', [classroomId], (err1) => {
    if (err1) return res.status(500).json({ message: 'ลบสมาชิกไม่สำเร็จ' });

    conn.query('DELETE FROM classroom WHERE classroom_id = ?', [classroomId], (err2) => {
      if (err2) return res.status(500).json({ message: 'ลบห้องไม่สำเร็จ' });
      res.json({ message: 'ลบห้องเรียนสำเร็จ' });
    });
  });
});

app.get('/classroom/:id/members', (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT u.id, u.name, u.lname, u.email, 'teacher' AS class_role
    FROM classroom c JOIN users u ON u.id = c.user_id WHERE c.classroom_id = ?
    UNION
    SELECT u.id, u.name, u.lname, u.email, 'student' AS class_role
    FROM classroom_member cm
    JOIN users u ON cm.user_id = u.id
    JOIN classroom c ON cm.classroom_id = c.classroom_id
    WHERE cm.classroom_id = ? AND u.id != c.user_id
  `;
  conn.query(sql, [id, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(result);
  });
});

app.post('/joinroom', (req, res) => {
  const { user_id, classroom_id } = req.body;
  conn.query(
    'INSERT IGNORE INTO classroom_member (user_id, classroom_id) VALUES (?, ?)',
    [user_id, classroom_id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Join failed' });
      res.json({ message: 'Joined successfully' });
    }
  );
});

// 📝 ข้อสอบ
app.post('/exams', (req, res) => {
  const { name, classroom_id, user_id } = req.body;
  if (!name || !classroom_id || !user_id)
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });

  conn.query(
    'SELECT * FROM classroom WHERE classroom_id = ? AND user_id = ?',
    [classroom_id, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
      if (result.length === 0)
        return res.status(403).json({ message: 'ไม่มีสิทธิ์เพิ่มข้อสอบ' });

      conn.query(
        'INSERT INTO exam (name, classroom_id) VALUES (?, ?)',
        [name, classroom_id],
        (err2, result2) => {
          if (err2) return res.status(500).json({ message: 'เพิ่มข้อสอบไม่สำเร็จ' });
          res.json({ message: 'เพิ่มข้อสอบสำเร็จ', exam_id: result2.insertId });
        }
      );
    }
  );
});

app.get('/exams/:classroom_id', (req, res) => {
  conn.query(
    'SELECT * FROM exam WHERE classroom_id = ?',
    [req.params.classroom_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'โหลดข้อสอบไม่สำเร็จ' });
      res.json(result);
    }
  );
});

app.delete('/deleteexam/:id', (req, res) => {
  const examId = req.params.id;

  const deleteAnswersSql = `
    DELETE a FROM answer a
    JOIN question q ON a.question_id = q.question_id
    WHERE q.exam_id = ?
  `;
  conn.query(deleteAnswersSql, [examId], (err1) => {
    if (err1) return res.status(500).json({ message: 'ลบคำตอบไม่สำเร็จ' });

    conn.query('DELETE FROM question WHERE exam_id = ?', [examId], (err2) => {
      if (err2) return res.status(500).json({ message: 'ลบคำถามไม่สำเร็จ' });

      conn.query('DELETE FROM exam WHERE exam_id = ?', [examId], (err3) => {
        if (err3) return res.status(500).json({ message: 'ลบข้อสอบไม่สำเร็จ' });
        res.json({ message: 'ลบข้อสอบเรียบร้อย' });
      });
    });
  });
});

// ❓ คำถาม/คำตอบ
app.post('/question', (req, res) => {
  const { exam_id, title } = req.body;
  if (!exam_id || !title)
    return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });

  conn.query(
    'INSERT INTO question (exam_id, title) VALUES (?, ?)',
    [exam_id, title],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'เพิ่มคำถามไม่สำเร็จ' });
      res.json({ message: 'เพิ่มคำถามสำเร็จ', question_id: result.insertId });
    }
  );
});

app.post('/answer', (req, res) => {
  const { question_id, choice_letter, choice_text, is_correct } = req.body;
  if (!question_id || !choice_letter || !choice_text || typeof is_correct !== 'boolean')
    return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });

  conn.query(
    'INSERT INTO answer (question_id, choice_letter, choice_text, is_correct) VALUES (?, ?, ?, ?)',
    [question_id, choice_letter, choice_text, is_correct],
    (err) => {
      if (err) return res.status(500).json({ message: 'เพิ่มคำตอบไม่สำเร็จ' });
      res.json({ message: 'เพิ่มคำตอบสำเร็จ' });
    }
  );
});

// ✅ ดึงคำถามทั้งหมดของข้อสอบ
// ดึงคำถามและตัวเลือกของแต่ละข้อสอบ
app.get('/questions/:exam_id', (req, res) => {
  const examId = req.params.exam_id;

  const sql = `
    SELECT q.question_id, q.title, q.image, a.answer_id, a.choice_letter, a.choice_text, a.is_correct
    FROM question q
    LEFT JOIN answer a ON q.question_id = a.question_id
    WHERE q.exam_id = ?
    ORDER BY q.question_id, a.choice_letter
  `;

  conn.query(sql, [examId], (err, results) => {
    if (err) {
      console.error('โหลดคำถามไม่สำเร็จ:', err);
      return res.status(500).json({ message: 'โหลดคำถามไม่สำเร็จ' });
    }

    // รวมคำถาม + choices
    const questionsMap = new Map();

    results.forEach(row => {
      if (!questionsMap.has(row.question_id)) {
        questionsMap.set(row.question_id, {
          question_id: row.question_id,
          title: row.title,
          image: row.image,
          choices: []
        });
      }

      if (row.answer_id) {
        questionsMap.get(row.question_id).choices.push({
          answer_id: row.answer_id,
          choice_letter: row.choice_letter,
          choice_text: row.choice_text,
          is_correct: !!row.is_correct
        });
      }
    });

    res.json(Array.from(questionsMap.values()));
  });
});

app.delete('/question/:id', (req, res) => {
  const questionId = req.params.id;

  const deleteAnswersSql = 'DELETE FROM answer WHERE question_id = ?';
  conn.query(deleteAnswersSql, [questionId], (err1) => {
    if (err1) return res.status(500).json({ message: 'ลบตัวเลือกไม่สำเร็จ' });

    const deleteQuestionSql = 'DELETE FROM question WHERE question_id = ?';
    conn.query(deleteQuestionSql, [questionId], (err2) => {
      if (err2) return res.status(500).json({ message: 'ลบคำถามไม่สำเร็จ' });

      res.json({ message: 'ลบคำถามเรียบร้อย' });
    });
  });
});

// เปิด/ปิดข้อสอบ
app.patch('/exam/:id/toggle', (req, res) => {
  const examId = req.params.id;

  // toggle ค่า is_open
  const sql = 'UPDATE exam SET is_open = NOT is_open WHERE exam_id = ?';
  conn.query(sql, [examId], (err, result) => {
    if (err) {
      console.error('Toggle exam error:', err);
      return res.status(500).json({ message: 'เปลี่ยนสถานะไม่สำเร็จ' });
    }
    res.json({ message: 'อัปเดตสถานะเรียบร้อย' });
  });
});

app.post('/submit-exam', (req, res) => {
  const { exam_id, user_id, answers } = req.body;

  if (!exam_id || !user_id || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });
  }

  let score = 0;

  // ตรวจคำตอบทั้งหมด
  const checkAnswer = async () => {
    for (const a of answers) {
      const { question_id, answer_id } = a;

      const sql = `SELECT is_correct FROM answer WHERE answer_id = ? AND question_id = ?`;
      const [result] = await conn.promise().query(sql, [answer_id, question_id]);

      const isCorrect = result[0]?.is_correct === 1;

      if (isCorrect) score++;

      // บันทึกคำตอบ
      await conn.promise().query(
        `INSERT INTO student_answer (user_id, exam_id, question_id, answer_id, is_correct)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, exam_id, question_id, answer_id, isCorrect]
      );
    }

    // สรุปผลสอบ
    await conn.promise().query(
      `INSERT INTO exam_result (user_id, exam_id, total_score) VALUES (?, ?, ?)`,
      [user_id, exam_id, score]
    );

    res.json({ message: 'ส่งข้อสอบสำเร็จ', score });
  };

  checkAnswer().catch(err => {
    console.error('Submit error:', err);
    res.status(500).json({ message: 'ส่งข้อสอบไม่สำเร็จ' });
  });
});

// ✅ ตรวจสอบว่า user เคยทำข้อสอบนี้แล้วหรือยัง
app.get('/check-submission/:exam_id/:user_id', (req, res) => {
  const { exam_id, user_id } = req.params;
  const sql = 'SELECT * FROM exam_result WHERE exam_id = ? AND user_id = ?';

  conn.query(sql, [exam_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    res.json({ submitted: results.length > 0 });
  });
});

app.get('/result/:exam_id/:user_id', async (req, res) => {
  const { exam_id, user_id } = req.params;

  const resultSql = `
    SELECT * FROM exam_result
    WHERE exam_id = ? AND user_id = ?
  `;
  const answerSql = `
    SELECT q.title, a.choice_letter, a.choice_text, sa.is_correct
    FROM student_answer sa
    JOIN question q ON sa.question_id = q.question_id
    JOIN answer a ON sa.answer_id = a.answer_id
    WHERE sa.exam_id = ? AND sa.user_id = ?
  `;

  conn.query(resultSql, [exam_id, user_id], (err, resultRows) => {
    if (err || resultRows.length === 0) return res.status(404).json({ message: 'ไม่พบผลลัพธ์' });

    conn.query(answerSql, [exam_id, user_id], (err2, answerRows) => {
      if (err2) return res.status(500).json({ message: 'โหลดคำตอบไม่สำเร็จ' });

      res.json({
        ...resultRows[0],
        answers: answerRows,
        total_question: answerRows.length
      });
    });
  });
});

// 📄 ใน backend Express (เพิ่มใน server.js หรือ index.js)
app.get('/results/:exam_id', (req, res) => {
  const { exam_id } = req.params;

  const sql = `
    SELECT 
      u.name, u.lname, u.email,
      r.total_score, r.submitted_at
    FROM exam_result r
    JOIN users u ON r.user_id = u.id
    WHERE r.exam_id = ?
    ORDER BY r.total_score DESC
  `;

  conn.query(sql, [exam_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'โหลดผลลัพธ์ไม่สำเร็จ' });
    res.json(results);
  });
});

app.patch('/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, lname, email } = req.body;

  if (!name || !lname || !email) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  const sql = 'UPDATE users SET name = ?, lname = ?, email = ? WHERE id = ?';
  conn.query(sql, [name, lname, email, id], (err) => {
    if (err) {
      console.error('Update user error:', err);
      return res.status(500).json({ message: 'อัปเดตข้อมูลไม่สำเร็จ' });
    }

    res.json({ message: 'อัปเดตข้อมูลเรียบร้อย' });
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // save in public/uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.post('/question-with-image', upload.single('image'), (req, res) => {
  const { exam_id, title } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!exam_id || !title)
    return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });

  const sql = 'INSERT INTO question (exam_id, title, image) VALUES (?, ?, ?)';
  conn.query(sql, [exam_id, title, image], (err, result) => {
    if (err) return res.status(500).json({ message: 'เพิ่มคำถามไม่สำเร็จ' });
    res.json({ message: 'เพิ่มคำถามสำเร็จ', question_id: result.insertId });
  });
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
