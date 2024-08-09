import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearToken } from "./LoginSlice";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("user");
    dispatch(clearToken());
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="btn btn-secondary">
      Logout
    </button>
  );
}