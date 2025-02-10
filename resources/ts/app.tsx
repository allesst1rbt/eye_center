import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./routes";

const appRoot = document.getElementById("app")!;
const root = createRoot(appRoot);
root.render(<AppRouter />);
