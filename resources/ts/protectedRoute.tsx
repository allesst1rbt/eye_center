import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BaseLayout from "./components/BaseLayout";
import { useAuth } from "./contexts/auth/AuthContext";

export function ProtectedRoute() {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
}
