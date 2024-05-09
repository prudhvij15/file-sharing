import React from "react";
import { Navigate, RouteProps } from "react-router-dom";

interface ProtectedRouteProps extends Omit<RouteProps, "element"> {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  ...rest
}) => {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace={true} />;
};

export default ProtectedRoute;
