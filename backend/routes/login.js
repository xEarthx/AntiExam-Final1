import express from 'express';
import cors from 'cors';
import conn from './db.js';

const app = express();

app.use(cors());
app.use(express.json()); // อ่าน req.body เป็น JSON

// Login route (POST /login)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  conn.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (results.length > 0) {
        const user = results[0];
        delete user.password;
        res.json({ user });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    }
  );
});

// เริ่มเซิร์ฟเวอร์
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
