// src/components/entrypoint/guest.tsx
import Login from '../login.tsx';
import Register from '../register.tsx';
import Home from '../user/home.tsx';
import Homeid from '../user/home.tsx';
import Notfoundpage from '../../notfoundpage.tsx';
import Hello from '../hello.tsx';

const guestRoutes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/home/:id/:title",
    element: <Homeid />
  },
  {
    path: "*",
    element: <Notfoundpage />
  },
  {
    path: "/",
    element: <Hello />
  }
];

export default guestRoutes;
