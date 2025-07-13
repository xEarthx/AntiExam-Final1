import { useLocation } from 'react-router-dom';

function ExitButton() {
  const { pathname } = useLocation();

  console.log("✅ Pathname:", pathname);

  // ✅ เพิ่ม path ของ DoExam ที่ต้องซ่อนปุ่ม
  const hiddenPaths = ['/'];

  // ⛔ ถ้าตรงกับ path `/do-exam/...` ก็ไม่ต้องแสดง
  const isDoExamPage = /^\/exam\/\d+\/do$/.test(pathname);

  if (hiddenPaths.includes(pathname) || isDoExamPage) return null;

  const handleExit = () => {
    window.electron?.ipcRenderer?.send('exit-app');
  };

  return (
    <button className="floating-exit-button" onClick={handleExit}>
      ออกจากแอพ
    </button>
  );
}

export default ExitButton;
