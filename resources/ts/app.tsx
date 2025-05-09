import { AllRoutes } from "@/routes";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <Toaster reverseOrder={false} />
    <AllRoutes />
  </React.StrictMode>
);
