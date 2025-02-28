import { useAuth } from "@/contexts/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "../assets/logout-icon.png";

export default function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="root">
      <img
        src={LogoutIcon}
        alt="logout"
        onClick={handleLogout}
        style={{ width: 100, height: 100, cursor: "pointer" }}
      />
    </div>
  );
}
