import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); // ✅ ลบข้อมูลผู้ใช้ที่ login
    alert('ออกจากระบบแล้ว');
    navigate('/login'); // ✅ ย้ายกลับไปหน้า login
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
