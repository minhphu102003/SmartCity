import React from "react";
import { Navigate } from "react-router-dom";
import { PATHS } from "../../constants";

const RequireAdmin = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const roles = auth?.roles || [];

  const isAdmin = roles.includes("admin");

  if (!isAdmin) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
