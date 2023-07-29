import Login from "../src/components/Login/Login";
import Menu from "../src/components/Menu/Menu";

import { useSelector } from "react-redux";
import { selectUser } from "../src/store/userSlicer/user.selector";

export default function Checking() {
  const user = useSelector(selectUser);

  return <>{user ? <Menu /> : <Login />}</>;
}
