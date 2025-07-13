import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
import guestRoutes from './components/entrypoint/guest.tsx'
import userRoutes from './components/entrypoint/users.tsx'
import adminRoutes from './components/entrypoint/admin.tsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LayoutWithExit from './components/LayoutWithExit.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWithExit />, // 👈 Layout ครอบทุกเส้นทาง
    children: [...guestRoutes, ...userRoutes, ...adminRoutes],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </React.StrictMode>,
)


// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
