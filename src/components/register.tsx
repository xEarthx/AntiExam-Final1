import { useState } from 'react';
import axios from 'axios';
import Nav from './nav';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../App.css';

function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    name: '',
    lname: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/register', {
        ...inputs,
        role: 'user'
      });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
      <div>
        <Nav />

        {/* ✅ ใส่ดาว background เหมือนหน้าอื่น */}
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>

        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="card-glass p-4" style={{ maxWidth: '500px', width: '100%' }}>
            <h2 className="text-center mb-4 text-white">สมัครสมาชิก</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="text-white">Username</label>
                <input className="form-control" name="username" value={inputs.username} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="text-white">Password</label>
                <input type="password" className="form-control" name="password" value={inputs.password} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="text-white">ชื่อ</label>
                <input className="form-control" name="name" value={inputs.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="text-white">นามสกุล</label>
                <input className="form-control" name="lname" value={inputs.lname} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="text-white">Email</label>
                <input type="email" className="form-control" name="email" value={inputs.email} onChange={handleChange} required />
              </div>
              <button className="btn btn-success w-100" type="submit">สมัครสมาชิก</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

export default Register;
