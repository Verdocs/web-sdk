import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BuildPage } from "./pages/BuildPage";
import { SignPage } from "./pages/SignPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BrandThemeCapturePage } from "./pages/BrandThemeCapturePage";
import { RequireBrandTheme } from "./components/RequireBrandTheme";

export const App = () => {
  const { pathname } = useLocation();
  const isSign = pathname === "/sign";

  return (
    <div className={`app ${isSign ? "app--sign" : ""}`}>
      <Routes>
        <Route path="/" element={<BrandThemeCapturePage />} />
        <Route element={<RequireBrandTheme />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/build" element={<BuildPage />} />
          <Route path="/sign" element={<SignPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
