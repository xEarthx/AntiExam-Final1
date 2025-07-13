import React, { useState } from 'react';
import Nav from '../nav';
import axios from 'axios';
import { toast } from 'react-toastify';

function CreateClass() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [description, setDescription] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/createclass', {
        name,
        room_id: roomId,
        description,
        user_id: user?.id
      });
      toast.success('✅ สร้างห้องเรียนสำเร็จ');
      setName('');
      setRoomId('');
      setDescription('');
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('❌ เกิดข้อผิดพลาดในการสร้างห้องเรียน');
      }
      console.error(err);
    }
  };

  return (
    <>
      <Nav />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="container d-flex justify-content-center align-items-center text-white" style={{ minHeight: '100vh' }}>
        <div className="card-glass p-4 w-100" style={{ maxWidth: '500px' }}>
          <h3 className="text-center mb-4">สร้างห้องเรียน</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">ชื่อห้อง</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Room ID (ตั้งเอง)</label>
              <input
                type="text"
                className="form-control"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">คำอธิบาย</label>
              <textarea
                className="form-control"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success w-100">✅ สร้างห้อง</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateClass;
