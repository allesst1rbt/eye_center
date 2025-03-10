import { useAuth } from "@/contexts/auth/AuthContext";
import { routePaths } from "@/routes";
import Logo from "@assets/eye-center-logo.svg";
import "@css/CustomSidebar.css";
import { IoMdHome } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";

export function CustomSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="custom-sidebar">
      <img src={Logo} alt="logo" className="logo" />

      <div className="items-container">
        <SidebarItem
          itemName="Dashboard"
          onClick={() => navigate(routePaths.home, { replace: true })}
        >
          <IoMdHome color={"#fff"} size={32} />
        </SidebarItem>
      </div>

      <button className="signout-button" onClick={logout}>
        Sair
      </button>
    </div>
  );
}
