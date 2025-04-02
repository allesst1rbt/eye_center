import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { LensProvider } from "./contexts/lens/LensProvider";
import { AllRoutes } from "./routes";

const appRoot = document.getElementById("app")!;
const root = createRoot(appRoot);

root.render(
  <AuthProvider>
    <LensProvider>
      <Toaster reverseOrder={false} />
      <AllRoutes />
    </LensProvider>
  </AuthProvider>
);
