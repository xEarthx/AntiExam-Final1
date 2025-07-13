import { useNavigate } from 'react-router-dom';
import '../App.css';

function Hello() {
  const navigate = useNavigate();

  return (
    <>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="d-flex justify-content-center align-items-center vh-100 text-center">
        <div className="p-4">
          <h1 className="mb-3 text-white">ยินดีต้อนรับเข้าสู่ระบบป้องกันการทุจริตในการสอบ</h1>
          <p className="mb-4 text-white">กรุณาเข้าสู่ระบบ หรือสมัครสมาชิกเพื่อเริ่มต้น</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary me-3">
            เข้าสู่ระบบ
          </button>
          <button onClick={() => navigate('/register')} className="btn btn-outline-success">
            สมัครสมาชิก
          </button>
        </div>
      </div>
    </>
  );
}

export default Hello;
