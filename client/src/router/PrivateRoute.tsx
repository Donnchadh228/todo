import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  isAuth: boolean;
}

const PrivateRoute = ({ isAuth }: PrivateRouteProps) => {
  const location = useLocation();
  return isAuth ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} />;
};

export default PrivateRoute;
