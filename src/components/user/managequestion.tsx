import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../nav';
import Swal from 'sweetalert2';

function ManageQuestion() {
  const { exam_id } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [choices, setChoices] = useState<string[]>(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // ✅ new
  const location = useLocation();
  const navigate = useNavigate();
  const fromClassroomId = location.state?.fromClassroomId;
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQuestions();
  }, [exam_id]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/questions/${exam_id}`);
      setQuestions(res.data);
    } catch (err) {
      console.error('โหลดคำถามไม่สำเร็จ', err);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || choices.some(c => !c.trim())) {
      Swal.fire({ icon: 'warning', title: 'กรุณากรอกคำถามและตัวเลือกให้ครบ' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('exam_id', exam_id || '');
      formData.append('title', newQuestion);
      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }

      const res = await axios.post('http://localhost:3001/question-with-image', formData);
      const question_id = res.data.question_id;

      await Promise.all(
        choices.map((text, index) =>
          axios.post('http://localhost:3001/answer', {
            question_id,
            choice_letter: String.fromCharCode(65 + index),
            choice_text: text,
            is_correct: index === correctIndex
          })
        )
      );

      setNewQuestion('');
      setChoices(['', '', '', '']);
      setCorrectIndex(0);
      setSelectedImageFile(null);
      fetchQuestions();

      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollBy(0, -100);
      }, 100);

      Swal.fire({ icon: 'success', title: 'เพิ่มคำถามสำเร็จ!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'เพิ่มคำถามไม่สำเร็จ' });
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คำถามนี้จะถูกลบถาวร',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/question/${questionId}`);
        setQuestions(prev => prev.filter(q => q.question_id !== questionId));
        Swal.fire({ icon: 'success', title: 'ลบคำถามเรียบร้อย', timer: 1200, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ลบคำถามไม่สำเร็จ' });
      }
    }
  };

  return (
    <>
      <Nav />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '30px' }}>
        <div ref={topRef} className="bg-white text-dark p-4 mb-4 d-flex align-items-center gap-2"
          style={{
            borderRadius: '16px',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            maxWidth: '800px',
            width: '100%',
            marginTop: '80px'
          }}
        >
          <button className="btn btn-outline-secondary me-3" onClick={() => navigate(`/classroom/${fromClassroomId}`)}>
            กลับหน้าห้องเรียน
          </button>
          <h3 className="m-0">จัดการคำถามในข้อสอบ</h3>
        </div>

        {/* กล่องเพิ่มคำถาม */}
        <div className="bg-white text-dark p-4 mb-4"
          style={{
            borderRadius: '16px',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
            maxWidth: '800px',
            width: '100%',
          }}
        >
          <h4 className="mb-3">➕ เพิ่มคำถามใหม่</h4>
          <textarea
            className="form-control mb-3"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="กรอกคำถาม"
            rows={3}
          />

          {/* ✅ Input อัปโหลดรูป */}
          <input
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedImageFile(e.target.files[0]);
              }
            }}
          />

          {choices.map((c, i) => (
            <div className="mb-2 d-flex align-items-center" key={i}>
              <input
                type="radio"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                className="me-2"
              />
              <span className="me-2">ตัวเลือก {String.fromCharCode(65 + i)}:</span>
              <input
                className="form-control"
                style={{ flex: 1 }}
                value={c}
                onChange={(e) => {
                  const copy = [...choices];
                  copy[i] = e.target.value;
                  setChoices(copy);
                }}
              />
            </div>
          ))}

          <button className="btn btn-success mt-3" onClick={handleAddQuestion}>✅ เพิ่มคำถาม</button>
        </div>

        {/* กล่องรายการคำถาม */}
        <div className="bg-white text-dark p-4"
          style={{
            borderRadius: '16px',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
            maxWidth: '800px',
            width: '100%',
          }}
        >
          <h4 className="mb-3">📋 คำถามที่มีแล้ว</h4>
          <ul className="list-unstyled">
            {questions.map((q: any) => (
              <li key={q.question_id} className="mb-3 border-bottom pb-2">
                ❓ <strong>{q.title}</strong>
                {q.image && <div><img src={`http://localhost:3001${q.image}`} alt="question" style={{ maxWidth: '100%', marginTop: 8 }} /></div>}
                <button className="btn btn-sm btn-outline-danger ms-2 mt-2" onClick={() => handleDeleteQuestion(q.question_id)}>
                  ลบคำถาม
                </button>
                <ul className="mt-2">
                  {(q.choices || []).map((c: any, idx: number) => (
                    <li key={idx}>
                      {String.fromCharCode(65 + idx)}. {c.choice_text} {c.is_correct && <span className="text-success">✅</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ManageQuestion;
