import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsLoggedIn } from "../Login/LoginSlice";

export default function Protected() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const sessionToken = window.sessionStorage.getItem("token");

  if (!isLoggedIn && !sessionToken) {
    return <Navigate to="/HomePage" />;
  }
  return <Outlet />;
}
