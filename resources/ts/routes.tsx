import { lazy, Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import { ProtectedRoute } from "./protectedRoute";

const SignIn = lazy(() => import("@pages/auth/SignIn"));
const Home = lazy(() => import("@pages/Home"));

export const routePaths = {
  login: "/login",
  home: "/home",
};

export function AllRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Outlet />}>
            <Route index element={<SignIn />} />
            <Route path={"login"} element={<SignIn />} />
            <Route element={<ProtectedRoute />}>
              <Route path={"home"} element={<Home />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}
