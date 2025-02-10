import React from "react";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import SignIn from "./pages/auth/SignIn";

const router = createBrowserRouter([
    { path: "/", element: <SignIn /> },
    // { path: "/", element: <Home /> },
    // { path: "/about", element: <About /> },
    { path: "*", element: <Navigate to="/" /> },
]);

const AppRouter: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
