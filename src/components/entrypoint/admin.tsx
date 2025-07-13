import Addash from "../admin/addash";
import Cc from "../admin/createclass";
import Cu from "../admin/createuser";
import Dc from "../admin/deleteclass";
import Du from "../admin/deleteuser";
import Ec from "../admin/editclass";
import Eu from "../admin/edituser";

const adminRoutes = [
  {
    path: "/addash",
    element: <Addash />
  },
  {
    path: "/createclassroom",
    element: <Cc />
  },
  {
    path: "/createuser",
    element: <Cu />
  },
  {
    path: "/deleteclassroom",
    element: <Dc />
  },
  {
    path: "/deleteuser",
    element: <Du />
  },
  {
    path: "/editclassroom",
    element: <Ec />
  },
  {
    path: "/edituser",
    element: <Eu />
  }
];

export default adminRoutes;
