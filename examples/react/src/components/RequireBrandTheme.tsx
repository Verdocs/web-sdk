import { Navigate, Outlet } from "react-router-dom";
import { hasBrandTheme } from "../lib/brandThemeSession";

export const RequireBrandTheme = () => {
  if (!hasBrandTheme()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
