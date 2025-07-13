import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../public/logo.png';
import Exit from './ExitButton';
import './nav.css';

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const pathname = location.pathname;
  const hiddenPaths = ['/'];
  const isDoExamPage = /^\/exam\/\d+\/do$/.test(pathname);
  const showExit = user && !hiddenPaths.includes(pathname) && !isDoExamPage;

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('ออกจากระบบแล้ว');
    navigate('/login');
  };

  return (
    <nav className="discord-navbar">
      <div className="nav-left">
        <Link to="/home" className="brand-link">
          <img src={logo} alt="logo" className="logo" />
          <span className="brand-name">Anti-Cheat Exam</span>
        </Link>
      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/login" className="btn-nav filled">เข้าสู่ระบบ</Link>
            <Link to="/register" className="btn-nav outlined">สมัครสมาชิก</Link>
          </>
        ) : (
          <>
            <Link to="/classroom" className="btn-nav outlined">ห้องเรียน</Link>
            <Link to="/createclass" className="btn-nav outlined">สร้างห้อง</Link>
            <Link to="/home" className="btn-nav outlined">👤 {user.name} {user.lname}</Link>
            <button onClick={handleLogout} className="btn-nav outlined">ออกจากระบบ</button>
          </>
        )}
      </div>

      {showExit && <Exit />} {/* ✅ แสดงเฉพาะเมื่อเข้าเงื่อนไข */}
    </nav>
  );
}

export default Nav;
