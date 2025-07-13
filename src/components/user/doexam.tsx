import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../nav';
import { toast } from 'react-toastify';

function DoExam() {
  const { exam_id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const [qRes, subRes] = await Promise.all([
          axios.get(`http://localhost:3001/questions/${exam_id}`),
          axios.get(`http://localhost:3001/check-submission/${exam_id}/${user.id}`)
        ]);
        setQuestions(qRes.data);
        setAlreadySubmitted(subRes.data.submitted);
      } catch {
        toast.error('❌ โหลดข้อมูลไม่สำเร็จ');
      }
    };
    fetchQuestions();
  }, [exam_id, user.id]);

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:3001/submit-exam`, {
        exam_id,
        user_id: user.id,
        answers: Object.entries(answers).map(([question_id, answer_id]) => ({
          question_id: Number(question_id),
          answer_id
        }))
      });
      toast.success('✅ ส่งข้อสอบเรียบร้อยแล้ว');
      setAlreadySubmitted(true);
    } catch {
      toast.error('❌ ส่งข้อสอบไม่สำเร็จ');
    }
  };

  return (
  <>
    {/*รอทำเสร็จค่อยลบ*/}
    <Nav />
    <div className="stars"></div>
    <div className="stars2"></div>
    <div className="stars3"></div>

    <div
      className="d-flex flex-column align-items-center"
      style={{ minHeight: '100vh', padding: '30px' }}
    >
      {/* กล่องหัวข้อ */}
      <div
        className="bg-white text-dark p-4 d-flex align-items-center gap-2 mb-4"
        style={{
          borderRadius: '16px',
          boxShadow: '0 0 25px rgba(0, 255, 255, 0.3)',
          maxWidth: '700px',
          width: '100%',
          marginTop: '70px'
        }}
      >
        <span role="img" style={{ fontSize: '28px' }}>📝</span>
        <h3 className="m-0">ทำข้อสอบ</h3>
      </div>

      {alreadySubmitted ? (
        <div
          className="bg-white text-dark p-4 text-center"
          style={{
            borderRadius: '16px',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)',
            maxWidth: '700px',
            width: '100%',
          }}
        >
          <p className="text-success">📌 คุณได้ส่งข้อสอบนี้ไปแล้ว</p>
          <button className="btn btn-info" onClick={() => navigate(`/exam/${exam_id}/result`)}>
            📊 ดูผลลัพธ์
          </button>
        </div>
      ) : (
        <>
          {questions.map((q, index) => (
            <div
              key={q.question_id}
              className="bg-white text-dark p-4 mb-3"
              style={{
                borderRadius: '16px',
                boxShadow: '0 0 12px rgba(0, 255, 255, 0.15)',
                maxWidth: '700px',
                width: '100%',
              }}
            >
              <h6 className="mb-3">❓ ข้อ {index + 1}: {q.title}</h6>
              {q.image && (
                <div>
                  <img
                    src={`http://localhost:3001${q.image}`}
                    alt="question"
                    style={{ maxWidth: '100%', marginBottom: '10px', marginTop: '8px' }}
                  />
                </div>
              )}
              <ul className="list-unstyled">
                {q.choices.map((c: any) => (
                  <li key={c.answer_id}>
                    <label>
                      <input
                        type="radio"
                        name={`q-${q.question_id}`}
                        value={c.answer_id}
                        checked={answers[q.question_id] === c.answer_id}
                        onChange={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [q.question_id]: c.answer_id
                          }))
                        }
                      />{" "}
                      {c.choice_letter}. {c.choice_text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div style={{ maxWidth: '700px', width: '100%' }}>
            <button className="btn btn-success w-100" onClick={handleSubmit}>✅ ส่งข้อสอบ</button>
          </div>
        </>
      )}
    </div>
  </>
  );
}

export default DoExam;
