import { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../nav';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import './Classroom.css';

function Classroom() {
  const [createdClassrooms, setCreatedClassrooms] = useState<any[]>([]);
  const [joinedClassrooms, setJoinedClassrooms] = useState<any[]>([]);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [examStats, setExamStats] = useState<{ [key: number]: { total: number, done: number } }>({});
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const getCardColor = (id: number) => {
    const colors = [
      '#2D9CDB', // ฟ้า
      '#27AE60', // เขียว
      '#EB5757', // แดง
      '#9B51E0', // ม่วง
      '#F2994A', // ส้ม
      '#F2C94C', // เหลือง
      '#56CCF2', // ฟ้าอ่อน
      '#BB6BD9', // ม่วงอมชมพู
    ];
    return colors[id % colors.length];
  };

  const handleLeaveRoom = (id: number) => {
    const updated = joinedClassrooms.filter(r => r.classroom_id !== id);
    setJoinedClassrooms(updated);
    localStorage.setItem(`joinedClassrooms_${user.id}`, JSON.stringify(updated));
    toast.info('ออกจากห้องเรียนแล้ว');
  };

  const handleDeleteClassroom = (id: number) => {
    Swal.fire({
      title: 'ยืนยันการลบ', text: 'ลบห้องนี้?', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'ใช่', cancelButtonText: 'ยกเลิก'
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/deleteclassroom/${id}`);
          setCreatedClassrooms(prev => prev.filter(r => r.classroom_id !== id));
          toast.success('ลบสำเร็จ');
        } catch {
          toast.error('ลบห้องไม่สำเร็จ');
        }
      }
    });
  };

  const handleJoinRoom = async () => {
    if (!roomIdInput.trim()) return toast.warn('กรุณากรอก Room ID');
    try {
      const { data: room } = await axios.get(`http://localhost:3001/findroom/${roomIdInput}`);
      const isJoined = joinedClassrooms.some(r => r.classroom_id === room.classroom_id);
      const isCreator = createdClassrooms.some(r => r.classroom_id === room.classroom_id);
      if (!isJoined && !isCreator) {
        await axios.post(`http://localhost:3001/joinroom`, { user_id: user.id, classroom_id: room.classroom_id });
        const updated = [...joinedClassrooms, room];
        setJoinedClassrooms(updated);
        localStorage.setItem(`joinedClassrooms_${user.id}`, JSON.stringify(updated));
      }
      toast.success('เข้าห้องเรียนสำเร็จ');
      navigate(`/classroom/${room.classroom_id}`);
    } catch {
      toast.error('ไม่พบห้องนี้');
    }
  };

  const fetchExamStats = async (classrooms: any[]) => {
    const stats: any = {};
    for (const room of classrooms) {
      try {
        const { data: exams } = await axios.get(`http://localhost:3001/exams/${room.classroom_id}`);
        const results = await Promise.all(exams.map((e: any) =>
          axios.get(`http://localhost:3001/exam/${e.exam_id}/result/${user.id}`).then(res => res.data).catch(() => null)
        ));
        const done = results.filter(r => r && r.score !== undefined).length;
        stats[room.classroom_id] = { total: exams.length, done };
      } catch {}
    }
    setExamStats(stats);
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const { data: created } = await axios.get(`http://localhost:3001/myclassroom/${user.id}`);
      setCreatedClassrooms(created);

      const stored = JSON.parse(localStorage.getItem(`joinedClassrooms_${user.id}`) || '[]');
      const valid = [];
      for (const room of stored) {
        try {
          const { data } = await axios.get(`http://localhost:3001/findroom/${room.room_id}`);
          valid.push(data); // 👈 data ต้องมี creator_name และ creator_id
        } catch {}
      }
      setJoinedClassrooms(valid);
      localStorage.setItem(`joinedClassrooms_${user.id}`, JSON.stringify(valid));

      await fetchExamStats([...created, ...valid]);
    };

    fetchData();
  }, [user?.id]);

  return (
    <>
      <Nav />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="container py-5 mt-5 text-white">
        <h2 className="text-center mb-5">ห้องเรียนของคุณ</h2>

        <div className="card-glass p-4 mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h4>เข้าห้องเรียนด้วย Room ID</h4>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              placeholder="เช่น ABC123"
            />
            <button className="btn btn-primary ms-2" onClick={handleJoinRoom}>เข้าห้อง</button>
          </div>
        </div>

        <div className="row g-4">
          {[...createdClassrooms, ...joinedClassrooms].map((room) => {
            const isCreator = createdClassrooms.some(r => r.classroom_id === room.classroom_id);
            return (
              <div key={room.classroom_id} className="col-sm-6 col-md-4 col-lg-3">
                <div
                  className="classroom-card p-3 rounded shadow position-relative"
                    style={{
                      border: `2px solid ${getCardColor(room.classroom_id)}`,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                >
                  <h5 className="fw-bold">{room.name}</h5>
                  <p className="mb-1">Room ID: {room.room_id}</p>
                  <p className="small text-white">คำอธิบาย :{room.description}</p>
                  {examStats[room.classroom_id] && (
                    <>
                      {room.creator_name && (
                        <p className="small text-white">
                          👨‍🏫 ผู้สร้าง: {room.creator_name}
                          {room.creator_id === user.id && <span className="text-success fw-bold ms-2">(คุณ)</span>}
                        </p>
                      )}
                      <div className="small mb-2 text-white">
                        ✅ {examStats[room.classroom_id].done} / {examStats[room.classroom_id].total} ข้อสอบ
                      </div>
                    </>
                  )}
                  <div className="d-flex justify-content-between mt-auto">
                    <button className="btn btn-sm btn-light" onClick={() => navigate(`/classroom/${room.classroom_id}`)}>เข้าห้อง</button>
                    {isCreator ? (
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClassroom(room.classroom_id)}>ลบ</button>
                    ) : (
                      <button className="btn btn-sm btn-danger" onClick={() => handleLeaveRoom(room.classroom_id)}>ออก</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Classroom;
