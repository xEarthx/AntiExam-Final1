import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './nav';
import { toast } from 'react-toastify';
import '../App.css';


function Login() {
  const [inputs, setInputs] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', inputs);
      const user = res.data.user;

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('เข้าสู่ระบบสำเร็จ');
        if (user.role === 'admin') navigate('/addash');
        else if (user.role === 'user') navigate('/classroom');
        else toast.warn('ไม่รู้จักบทบาทผู้ใช้');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <>
      <Nav />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card-glass p-4">
          <h3 className="text-center mb-4 text-white">เข้าสู่ระบบ</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-white">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={inputs.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="text-white">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
