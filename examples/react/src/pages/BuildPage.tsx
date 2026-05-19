import { useEffect, useState } from "react";
import { BuildWorkflow } from "../components/build/BuildWorkflow";
import { BuildControls } from "../components/build/BuildControls";
import { ThemeBanner } from "../components/shared/ThemeBanner";
import { ColorPalette } from "../components/shared/ColorPalette";
import { AuthPage } from "./AuthPage";
import {
  clearBuilderSession,
  hasBuilderSession,
  loadBuilderSession,
  loadStoredTemplateId,
  saveStoredTemplateId,
  subscribeToSession,
} from "../lib/authSession";
import type { TVerdocsBuildStep } from "../lib/buildStorage";
import { useVerdocsTheme } from "../lib/useVerdocsTheme";

export const BuildPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateIdInput, setTemplateIdInput] = useState("");
  const [step, setStep] = useState<TVerdocsBuildStep>("attachments");
  const [themeRevision, setThemeRevision] = useState(0);
  const { enabled: customThemeEnabled, setEnabled: setCustomThemeEnabled } = useVerdocsTheme(true);

  useEffect(() => {
    loadBuilderSession();
    setAuthenticated(hasBuilderSession());
    const stored = loadStoredTemplateId();
    if (stored) {
      setTemplateId(stored);
      setTemplateIdInput(stored);
    }
    setCheckingSession(false);

    return subscribeToSession((isAuthed) => {
      setAuthenticated(isAuthed);
    });
  }, []);

  useEffect(() => {
    setThemeRevision((r) => r + 1);
  }, [customThemeEnabled]);

  const handleUseTemplate = () => {
    const id = templateIdInput.trim();
    if (!id) {
      return;
    }
    saveStoredTemplateId(id);
    setTemplateId(id);
    setStep("attachments");
  };

  const handleNewTemplate = () => {
    saveStoredTemplateId(null);
    setTemplateId(null);
    setTemplateIdInput("");
    setStep("attachments");
  };

  const handleSignOut = () => {
    clearBuilderSession();
    setAuthenticated(false);
    setTemplateId(null);
  };

  if (checkingSession) {
    return (
      <div className="auth-loading">
        <p>Checking session…</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AuthPage
        customThemeEnabled={customThemeEnabled}
        onThemeChange={setCustomThemeEnabled}
        themeRevision={themeRevision}
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <>
      <div className="build-page-header">
        <p className="page-intro">
          React reference for <code>VerdocsBuild</code> — upload, recipients/workflow, fields, and send. After sending,
          open <strong>Sign</strong> to try <code>VerdocsSign</code>.
        </p>
        <button type="button" className="sign-out-btn" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <ThemeBanner enabled={customThemeEnabled} onChange={setCustomThemeEnabled} variant="build" />
      <ColorPalette themeRevision={themeRevision} />

      <BuildControls
        templateId={templateId}
        step={step}
        templateIdInput={templateIdInput}
        onTemplateIdInputChange={setTemplateIdInput}
        onUseTemplate={handleUseTemplate}
        onStepChange={setStep}
        onNewTemplate={handleNewTemplate}
      />

      <section className={`section section--builder ${customThemeEnabled ? "section--themed" : ""}`}>
        <div className="section-header">
          <h2>
            Template builder
            {templateId && <span className="step-badge">template {templateId.slice(0, 8)}…</span>}
            {customThemeEnabled && <span className="step-badge step-badge--theme">themed</span>}
          </h2>
          <p>
            Steps 2–4 use <code>VerdocsBuild</code>. In Workflow, drag roles to set <strong>sequence</strong> (levels)
            and <strong>order</strong> (position within a level).
          </p>
        </div>
        <div className="section-body section-body--builder">
          <BuildWorkflow
            templateId={templateId}
            step={step}
            onTemplateIdChange={(id) => {
              setTemplateId(id);
              if (id) {
                setTemplateIdInput(id);
              }
            }}
            onStepChange={setStep}
          />
        </div>
      </section>

      {/* <section className={`section ${customThemeEnabled ? "section--themed" : ""}`}>
        <div className="section-header">
          <h2>Field styling gallery</h2>
          <p>Same CSS variables as the Fields step in the builder above.</p>
        </div>
        <div className="section-body">
          <FieldStyleGallery />
        </div>
      </section> */}
    </>
  );
};
