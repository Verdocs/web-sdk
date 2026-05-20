import { useEffect, useState } from "react";
import { BuildWorkflow } from "../components/build/BuildWorkflow";
import { ThemeBanner } from "../components/shared/ThemeBanner";
import { hasBuilderSession, loadBuilderSession, loadStoredTemplateId, subscribeToSession } from "../lib/authSession";
import type { TVerdocsBuildStep } from "../lib/buildStorage";
import { useExampleTheme } from "../lib/useVerdocsTheme";
import { getThemeBadgeLabel } from "../lib/themeBadge";
import NavTags from "../components/navTags/NavTags";

export const BuildPage = () => {
  const [, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [templateId, setTemplateId] = useState<string | null>("6cf58bcb-b354-4804-aea3-12d711d6b732");
  const [step, setStep] = useState<TVerdocsBuildStep>("attachments");
  const { themeId, setThemeId, isCustomTheme } = useExampleTheme("wayfair");
  const themeBadge = getThemeBadgeLabel(themeId);

  useEffect(() => {
    loadBuilderSession();
    setAuthenticated(hasBuilderSession());
    const stored = loadStoredTemplateId();
    if (stored) {
      setTemplateId(stored);
    }
    setCheckingSession(false);

    return subscribeToSession((isAuthed) => {
      setAuthenticated(isAuthed);
    });
  }, []);

  if (checkingSession) {
    return (
      <div className="auth-loading">
        <p>Checking session…</p>
      </div>
    );
  }

  return (
    <>
      <ThemeBanner themeId={themeId} onChange={setThemeId} />
      <NavTags />

      <section className={`section section--builder ${isCustomTheme ? "section--themed" : ""}`}>
        <div className="section-header">
          <h2>
            Template builder
            {themeBadge && <span className="step-badge step-badge--theme">{themeBadge}</span>}
          </h2>
        </div>
        <div className="section-body section-body--builder">
          <BuildWorkflow
            templateId={templateId}
            step={step}
            onTemplateIdChange={(id) => {
              setTemplateId(id);
            }}
            onStepChange={setStep}
          />
        </div>
      </section>
    </>
  );
};
