import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../router/PrivateRoute.tsx";
import { privateRoutes, publicRoutes } from "../router/index.ts";
import ErrorPages from "../pages/ErrorPages/ErrorPages.tsx";
import { useTypedSelector } from "../hooks/useTypedSelector.ts";

const AppRouter = () => {
  const { user } = useTypedSelector(state => state.user);
  const isAuth = user ? true : false;
  return (
    <div>
      <Routes>
        <Route>
          {publicRoutes.map(route => {
            return <Route path={route.path} element={<route.component />} />;
          })}
        </Route>

        <Route element={<PrivateRoute isAuth={isAuth} />}>
          {privateRoutes.map(route => {
            return <Route path={route.path} element={<route.component />} />;
          })}
        </Route>

        <Route path="*" element={<ErrorPages />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
