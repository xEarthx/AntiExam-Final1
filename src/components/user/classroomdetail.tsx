import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../nav';
import { toast } from 'react-toastify';

function ClassroomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [room, setRoom] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [showAddExam, setShowAddExam] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [roomRes, examRes, memberRes] = await Promise.all([
          axios.get(`http://localhost:3001/classroom/${id}`),
          axios.get(`http://localhost:3001/exams/${id}`),
          axios.get(`http://localhost:3001/classroom/${id}/members`)
        ]);
        setRoom(roomRes.data);
        setExams(examRes.data);
        setMembers(memberRes.data);
        const me = memberRes.data.find((m: any) => m.id === user.id);
        setIsTeacher(me?.class_role === 'teacher');
      } catch (err) {
        console.error('โหลดข้อมูลไม่สำเร็จ:', err);
      }
    })();
  }, [id, user.id]);

  const handleAddExam = async () => {
    if (!newExamName.trim()) return alert('กรุณากรอกชื่อข้อสอบ');
    try {
      const res = await axios.post('http://localhost:3001/exams', {
        name: newExamName, classroom_id: Number(id), user_id: user.id
      });
      const examId = res.data.exam_id;
      setExams(prev => [...prev, { name: newExamName, exam_id: examId, is_open: 0 }]);
      setNewExamName('');
      setShowAddExam(false);
      toast.success('✅ เพิ่มข้อสอบสำเร็จ');
      navigate(`/exam/${examId}/questions`, { state: { fromClassroomId: id } });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'เพิ่มข้อสอบไม่สำเร็จ');
    }
  };

  const handleDeleteExam = async (exam_id: number) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อสอบนี้?')) return;
    try {
      await axios.delete(`http://localhost:3001/deleteexam/${exam_id}`);
      setExams(exams.filter(e => e.exam_id !== exam_id));
      toast.success('✅ ลบข้อสอบเรียบร้อย');
    } catch {
      toast.error('❌ ลบข้อสอบไม่สำเร็จ');
    }
  };

  const toggleExamStatus = async (exam_id: number) => {
    try {
      await axios.patch(`http://localhost:3001/exam/${exam_id}/toggle`);
      setExams(exams.map(e => e.exam_id === exam_id ? { ...e, is_open: e.is_open ? 0 : 1 } : e));
    } catch {
      toast.error('❌ เปลี่ยนสถานะไม่สำเร็จ');
    }
  };

  return (
    <>
      <Nav />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div
        className="d-flex justify-content-center align-items-center text-white"
        style={{ minHeight: '100vh', padding: '40px 0' }}
      >
        {!room ? (
          <div className="text-center"><p>กำลังโหลดข้อมูลห้อง...</p></div>
        ) : (
          <div className="row w-100" style={{ maxWidth: '1200px' }}>
            {/* กล่องข้อสอบ */}
            <div className="col-lg-8 mb-4">
              <div className="p-4" style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 0 10px rgba(0,0,0,0.4)'
              }}>
                <h3 className="mb-3">ชื่อห้อง: {room.name}</h3>
                <p>Room ID: {room.room_id}</p>
                <p>คำอธิบาย : {room.description}</p>

                <h4 className="mt-4">ข้อสอบในห้องนี้</h4>
                {isTeacher && !showAddExam && (
                  <button className="btn btn-primary btn-sm mb-3" onClick={() => setShowAddExam(true)}>➕ เพิ่มข้อสอบ</button>
                )}

                {isTeacher && showAddExam && (
                  <div className="mb-3">
                    <input className="form-control mb-2" placeholder="ชื่อข้อสอบ" value={newExamName} onChange={(e) => setNewExamName(e.target.value)} />
                    <button className="btn btn-success btn-sm me-2" onClick={handleAddExam}>บันทึก</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowAddExam(false)}>ยกเลิก</button>
                  </div>
                )}

                <ul className="list-unstyled">
                  {exams.map((exam: any) => (
                    <li key={exam.exam_id} className="mb-3 border-bottom pb-2">
                      📝 <strong>{exam.name}</strong>
                      {isTeacher ? (
                        <>
                          <button className="btn btn-outline-light btn-sm ms-2" onClick={() => navigate(`/exam/${exam.exam_id}/questions`, { state: { fromClassroomId: id } })}>จัดการคำถาม</button>
                          <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeleteExam(exam.exam_id)}>🗑 ลบ</button>
                          <button className="btn btn-warning btn-sm ms-2" onClick={() => toggleExamStatus(exam.exam_id)}>
                            {exam.is_open ? '🔓 ข้อสอบกำลังถูกเปิด' : '🔒 ข้อสอบกำลังถูกปิด'}
                          </button>
                          <button className="btn btn-info btn-sm ms-2" onClick={() => navigate(`/exam/${exam.exam_id}/all-results`)}>📊 ดูผลลัพธ์นักเรียนทั้งหมด</button>
                        </>
                      ) : (
                        exam.is_open === 1
                          ? <button className="btn btn-success btn-sm ms-2" onClick={() => navigate(`/exam/${exam.exam_id}/do`)}>🚀 เข้าทำข้อสอบ</button>
                          : <span className="btn btn-success btn-sm ms-2">🚫 ข้อสอบนี้ถูกปิดแล้ว</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* กล่องสมาชิก */}
            <div className="col-lg-4">
              <div className="p-4" style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 0 10px rgba(0,0,0,0.4)'
              }}>
                <h5 className="mb-3">👥 สมาชิกทั้งหมด</h5>
                <ul className="list-unstyled">
                  {members.map((m: any) => (
                    <li key={m.id}>
                      👤 {m.name} {m.lname} ({m.email}) {m.class_role === 'teacher' ? ' (ครู)' : ' (นักเรียน)'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ClassroomDetail;
