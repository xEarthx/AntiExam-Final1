import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Nav from '../nav';

function ExamResult() {
  const { exam_id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/result/${exam_id}/${user.id}`);
        setResult(res.data);
      } catch (err) {
        console.error('โหลดผลลัพธ์ไม่สำเร็จ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [exam_id, user.id]);

  return (
    <>
      <Nav />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="d-flex justify-content-center align-items-start" style={{ minHeight: '100vh', paddingTop: '80px' }}>
        <div className="bg-white text-dark p-4 rounded-4 shadow-lg"
          style={{
            maxWidth: '800px',
            width: '100%',
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 0 25px rgba(0, 255, 255, 0.2)',
            marginTop: '60px'
          }}
        >
          <h3 className="text-center mb-4">📊 ผลลัพธ์ข้อสอบ</h3>

          {loading ? (
            <p className="text-center">⏳ กำลังโหลดผลลัพธ์...</p>
          ) : result ? (
            <div>
              <p>👤 ผู้สอบ: <strong>{user.name} {user.lname}</strong></p>
              <p>📅 ส่งเมื่อ: {new Date(result.submitted_at).toLocaleString()}</p>
              <p className="fs-5">🎯 คะแนน: <strong className="text-success">{result.total_score}</strong> / {result.total_question}</p>

              <hr />

              <h5 className="mb-3">📝 รายละเอียดคำตอบ:</h5>
              <ul className="list-group">
                {result.answers.map((ans: any, idx: number) => (
                  <li key={idx} className={`list-group-item d-flex justify-content-between align-items-start ${ans.is_correct ? 'list-group-item-success' : 'list-group-item-danger'}`}>
                    <div>
                      <div>❓ <strong>{ans.title}</strong></div>
                      <div>➤ คำตอบของคุณ: <strong>{ans.choice_letter}. {ans.choice_text}</strong></div>
                    </div>
                    <span>{ans.is_correct ? '✅' : '❌'}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-danger">❌ ไม่พบผลลัพธ์</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ExamResult;
