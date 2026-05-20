import { useState } from "react";
import NavTags from "../components/navTags/NavTags";
import { IntroductionPackageModal } from "../components/dashboard/IntroductionPackageModal";
import { useExampleTheme } from "../lib/useVerdocsTheme";
import { ThemeBanner } from "../components/shared/ThemeBanner";
import { IntroductionPackage } from "../components/dashboard/IntroductionPackage";
import { DemoGrid } from "../components/dashboard/DemoGrid";
// import { AuthPage } from "./AuthPage";

export const DashboardPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { themeId, setThemeId } = useExampleTheme();

  return (
    <div className="dashboard-page">
      <IntroductionPackage setModalOpen={setModalOpen} />
      <ThemeBanner themeId={themeId} onChange={setThemeId} />
      <NavTags />

      {/* <DashboardHeader /> */}

      <DemoGrid />
      <IntroductionPackageModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {/* TODO: Remove this once we figure out the solution to create a valid session for the user */}
      {/* <AuthPage /> */}
    </div>
  );
};
