import { BuildPage } from "./pages/BuildPage";
import { SignPage } from "./pages/SignPage";
import { DashboardPage } from "./pages/DashboardPage";
import { useHashRoute } from "./lib/useHashRoute";

export const App = () => {
  const route = useHashRoute();

  return (
    <div className={`app ${route === "sign" ? "app--sign" : ""}`}>
      {route === "sign" ? <SignPage /> : route === "build" ? <BuildPage /> : <DashboardPage />}
    </div>
  );
};
