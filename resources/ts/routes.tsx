import { ReactElement } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import Home from "./pages/Home";

const isAuthenticated = (): boolean => !!localStorage.getItem("token");

type ProtectedRouteProps = {
  element: ReactElement;
};

const ProtectedRoute = ({ element }: ProtectedRouteProps): ReactElement => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: isAuthenticated() ? <Navigate to="/dashboard" /> : <SignIn />,
  },
  { path: "/dashboard", element: <ProtectedRoute element={<Home />} /> },
  {
    path: "*",
    element: <Navigate to={isAuthenticated() ? "/dashboard" : "/"} />,
  },
]);
