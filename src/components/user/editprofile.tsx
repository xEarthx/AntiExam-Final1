import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../nav';
import { toast } from 'react-toastify';

function EditProfile() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [lname, setLname] = useState(user?.lname || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://localhost:3001/user/${user.id}`, {
        name,
        lname,
        email
      });

      const updatedUser = { ...user, name, lname, email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('✅ อัปเดตข้อมูลเรียบร้อย');
      navigate('/');
    } catch (err) {
      toast.error('❌ อัปเดตข้อมูลไม่สำเร็จ');
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
        <div
          className="p-4 w-100"
          style={{
            maxWidth: '500px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            boxShadow: '0 0 10px rgba(0,0,0,0.4)'
          }}
        >
          <h3 className="mb-4 text-center">🧑‍💼 แก้ไขข้อมูลส่วนตัว</h3>
          <div className="mb-3">
            <label className="form-label">ชื่อ</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">นามสกุล</label>
            <input className="form-control" value={lname} onChange={(e) => setLname(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">อีเมล</label>
            <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="btn btn-success w-100" onClick={handleUpdate}>
            💾 บันทึกข้อมูล
          </button>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
