import BaseLayout from "@/components/BaseLayout";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function ProtectedRoute() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

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
