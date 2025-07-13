import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Nav from '../nav';

function TeacherResults() {
  const { exam_id } = useParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/results/${exam_id}`);
        setResults(res.data);
      } catch (err) {
        console.error('โหลดผลลัพธ์ไม่สำเร็จ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [exam_id]);

  return (
    <>
      <Nav />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="d-flex justify-content-center align-items-start" style={{ minHeight: '100vh', paddingTop: '80px' }}>
        <div className="bg-white text-dark p-4 rounded-4 shadow-lg"
          style={{
            maxWidth: '900px',
            width: '100%',
            backdropFilter: 'blur(15px)',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.25)',
            marginTop: '60px'
          }}
        >
          <h3 className="text-center mb-4">📋 ผลลัพธ์ของนักเรียนทั้งหมด</h3>

          {loading ? (
            <p className="text-center">⏳ กำลังโหลดข้อมูล...</p>
          ) : results.length === 0 ? (
            <p className="text-center text-muted">❌ ยังไม่มีใครส่งข้อสอบนี้</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>Email</th>
                    <th>คะแนน</th>
                    <th>เวลาที่ส่ง</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{r.name}</td>
                      <td>{r.lname}</td>
                      <td>{r.email}</td>
                      <td className="fw-bold text-success">{r.total_score}</td>
                      <td>{new Date(r.submitted_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TeacherResults;
