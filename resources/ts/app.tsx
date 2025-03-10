import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { AllRoutes } from "./routes";

const appRoot = document.getElementById("app")!;
const root = createRoot(appRoot);

root.render(
  <AuthProvider>
    <AllRoutes />
  </AuthProvider>
);
