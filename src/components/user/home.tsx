import { useNavigate } from 'react-router-dom';
import Nav from '../nav';
import '../../App.css'; // หากใส่สไตล์ที่นี่

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    return (
      <>
        <Nav />
        <div className="d-flex justify-content-center align-items-center vh-100 text-white">
          <h2>กรุณาเข้าสู่ระบบก่อนใช้งาน</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card-glass text-white p-4" style={{ minWidth: '400px' }}>
          <h2 className="text-center mb-4">ข้อมูลผู้ใช้งาน</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><strong>ชื่อผู้ใช้:</strong> {user.username}</li>
            <li><strong>ชื่อ:</strong> {user.name}</li>
            <li><strong>นามสกุล:</strong> {user.lname}</li>
            <li><strong>อีเมล:</strong> {user.email}</li>
            <li><strong>บทบาท:</strong> {user.role}</li>
          </ul>
          <button
            onClick={() => navigate('/edit-profile')}
            className="btn btn-outline-light w-100 mt-3"
          >
            แก้ไขข้อมูล
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
