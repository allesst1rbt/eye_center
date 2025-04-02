import { lazy, Suspense } from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import Splash from "./pages/Splash";
import { ProtectedRoute } from "./protectedRoute";

const SignIn = lazy(() => import("@pages/auth/SignIn"));
const Home = lazy(() => import("@pages/Home"));

export const routePaths = {
  base: "/",
  login: "/login",
  home: "/home",
};

export function AllRoutes() {
  const { base, login, home } = routePaths;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <HashRouter>
        <Routes>
          <Route path={base} element={<Outlet />}>
            <Route index element={<Splash />} />
            <Route path={login} element={<SignIn />} />
            <Route element={<ProtectedRoute />}>
              <Route path={home} element={<Home />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </Suspense>
  );
}
