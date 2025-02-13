import { createBrowserRouter, Navigate } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  { path: "/", element: <SignIn /> },
  { path: "/dashboard", element: <Home /> },
  { path: "*", element: <Navigate to="/login" /> },
]);
