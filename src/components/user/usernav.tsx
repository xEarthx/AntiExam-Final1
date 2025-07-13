import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../../public/logo.png'; // อิมพอร์ตโลโก้
import './nav.css';


function Nav() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('ออกจากระบบแล้ว');
    navigate('/login');
  };

  return (
    <nav className="custom-nav">
      <div className="nav-left">
        <Link to="/home" className="logo-wrap">
          <img src={logo} alt="Logo" className="nav-logo" />
          <span className="logo-text">Anti-Cheat Exam</span>
        </Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <Link to="/classroom">ห้องเรียน</Link>
            <Link to="/createclass">สร้างห้อง</Link>
            <Link to="/home" className="user-badge">
              👤 {user.name} {user.lname}
            </Link>
            <button onClick={handleLogout}>ออกจากระบบ</button>

            {/* ✅ ย้ายปุ่มออกจากแอพมาไว้ที่นี่ */}

          </>
        ) : (
          <>
            <Link to="/login">เข้าสู่ระบบ</Link>
            <Link to="/register">สมัครสมาชิก</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;
