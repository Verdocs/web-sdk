import { useCallback, useEffect, useState } from "react";
import { BuildWorkflow } from "./components/BuildWorkflow";
import { EventLog } from "./components/EventLog";
import { FieldStyleGallery } from "./components/FieldStyleGallery";
import { ThemeBanner } from "./components/ThemeBanner";
import { ThemeToggle } from "./components/ThemeToggle";
import { authenticateVerdocs, getCredentialsFromEnv, getInitialTemplateId } from "./lib/verdocsAuth";
import { useVerdocsTheme } from "./lib/useVerdocsTheme";
import type { LogEntry } from "./lib/eventLog";

export const App = () => {
  const [authState, setAuthState] = useState<"loading" | "ready" | "error">("loading");
  const [authError, setAuthError] = useState<string | null>(null);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const { enabled: customThemeEnabled, setEnabled: setCustomThemeEnabled } = useVerdocsTheme(true);

  const appendLog = useCallback((entry: LogEntry) => {
    setLogEntries((prev) => [entry, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    const credentials = getCredentialsFromEnv();
    if (!credentials) {
      setAuthState("error");
      setAuthError("Set VITE_VERDOCS_USERNAME and VITE_VERDOCS_PASSWORD in a .env file (see .env.example).");
      return;
    }

    authenticateVerdocs(credentials)
      .then(() => setAuthState("ready"))
      .catch((err: Error) => {
        setAuthState("error");
        setAuthError(err.message ?? "Authentication failed.");
      });
  }, []);

  if (authState === "loading") {
    return (
      <div className="app auth-loading">
        <p>Authenticating with Verdocs…</p>
      </div>
    );
  }

  if (authState === "error") {
    return (
      <div className="app auth-error">
        <h1>Verdocs Build Example</h1>
        <p>{authError}</p>
        <p>
          Copy <code>.env.example</code> to <code>.env</code> and add your credentials.
        </p>
      </div>
    );
  }

  const initialTemplateId = getInitialTemplateId();

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Verdocs Build Example</h1>
          <p>
            React reference for <code>VerdocsBuild</code> — template builder, recipient workflow, field placement, and
            send.
          </p>
        </div>
        <div className="app-header-actions">
          {/* <ThemeToggle enabled={customThemeEnabled} onChange={setCustomThemeEnabled} variant="compact" /> */}
        </div>
      </header>

      <ThemeBanner enabled={customThemeEnabled} onChange={setCustomThemeEnabled} />

      <section className={`section section--builder ${customThemeEnabled ? "section--themed" : ""}`}>
        <div className="section-header">
          <h2>
            Template builder
            {initialTemplateId && (
              <span className="step-badge">resuming template {initialTemplateId.slice(0, 8)}…</span>
            )}
            {customThemeEnabled && <span className="step-badge step-badge--theme">themed</span>}
          </h2>
          <p>
            Step 1: upload (via <code>VerdocsTemplateCreate</code>). Steps 2–4: recipients/workflow, fields, preview
            &amp; send (via <code>VerdocsBuild</code>). In the Workflow step, drag roles to set{" "}
            <strong>sequence</strong> (signing order levels) and <strong>order</strong> (position within a level).
          </p>
        </div>
        <div className="section-body section-body--builder">
          <BuildWorkflow initialTemplateId={initialTemplateId} onLog={appendLog} />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>SDK event log</h2>
          <p>
            Handlers on <code>VerdocsBuild</code> — watch role sequence/order updates after template changes on the
            Workflow step.
          </p>
        </div>
        <div className="section-body">
          <EventLog entries={logEntries} />
        </div>
      </section>

      <section className={`section ${customThemeEnabled ? "section--themed" : ""}`}>
        <div className="section-header">
          <h2>Field styling gallery</h2>
          <p>
            Signing fields use the same CSS variables as the builder Fields step. Toggle the theme banner above to
            compare default vs. custom branding.
          </p>
        </div>
        <div className="section-body">
          <FieldStyleGallery />
        </div>
      </section>
    </div>
  );
};
