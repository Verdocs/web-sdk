import { Navigate } from "react-router-dom";
import { BrandThemeCapture } from "../components/dashboard/BrandThemeCapture";
import { hasBrandTheme } from "../lib/brandThemeSession";

export const BrandThemeCapturePage = () => {
  if (hasBrandTheme()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="dashboard-page">
      <BrandThemeCapture />
    </div>
  );
};
