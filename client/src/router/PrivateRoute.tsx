import { Navigate, Outlet, useLocation } from "react-router-dom";
import { publicRoutesConfig } from "../utils/const";
interface PrivateRouteProps {
  isAuth: boolean;
}

const PrivateRoute = ({ isAuth }: PrivateRouteProps) => {
  const location = useLocation();
  return isAuth ? <Outlet /> : <Navigate to={publicRoutesConfig.LOGIN} state={{ from: location.pathname }} />;
};

export default PrivateRoute;
