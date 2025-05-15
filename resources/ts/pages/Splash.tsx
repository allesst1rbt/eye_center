import EyeCenterLogo from "@/assets/eye-center-logo.svg";
import { routePaths } from "@/routes";
import { useAuthStore } from "@/stores/authStore";
import { setRedirectToLogin } from "@/utils/api";
import "@css/Splash.css";
import { CSSProperties, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const Splash = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const loginPath = routePaths.login;

  const redirectToLogin = () => navigate(loginPath);

  setRedirectToLogin(redirectToLogin);

  useEffect(() => {
    if (token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [token]);

  return (
    <div className="splash_container">
      <img src={EyeCenterLogo} alt="eye_center_logo" />
      <ClipLoader
        color={"#FFFFFF"}
        loading={true}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Splash;
