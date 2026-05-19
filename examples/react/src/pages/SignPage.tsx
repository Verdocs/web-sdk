import { useEffect, useMemo, useState } from "react";
import { SignPanel } from "../components/sign/SignPanel";
import { SigningCredentialsForm } from "../components/sign/SigningCredentialsForm";
import { ThemeBanner } from "../components/shared/ThemeBanner";
import { loadSigningContext } from "../lib/signingSession";
import type { SigningParams } from "../lib/signingSession";
import { useVerdocsTheme } from "../lib/useVerdocsTheme";

export const SignPage = () => {
  const [envelopeId, setEnvelopeId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isSigningActive, setIsSigningActive] = useState(false);
  const [partialFromSend, setPartialFromSend] = useState(false);
  const { enabled: customThemeEnabled, setEnabled: setCustomThemeEnabled } = useVerdocsTheme(true);

  useEffect(() => {
    const context = loadSigningContext();
    if (!context) {
      return;
    }

    if (context.envelopeId) {
      setEnvelopeId(context.envelopeId);
    }
    if (context.roleId) {
      setRoleId(context.roleId);
    }
    if (context.inviteCode) {
      setInviteCode(context.inviteCode);
    }

    if (context.source === "send" && context.envelopeId && (!context.roleId || !context.inviteCode)) {
      setPartialFromSend(true);
    }
  }, []);

  const signingParams = useMemo((): SigningParams | null => {
    const trimmedEnvelopeId = envelopeId.trim();
    const trimmedRoleId = roleId.trim();
    const trimmedInviteCode = inviteCode.trim();

    if (!trimmedEnvelopeId || !trimmedRoleId || !trimmedInviteCode) {
      return null;
    }

    return {
      envelopeId: trimmedEnvelopeId,
      roleId: trimmedRoleId,
      inviteCode: trimmedInviteCode,
    };
  }, [envelopeId, roleId, inviteCode]);

  const handleStartSigning = () => {
    if (signingParams) {
      setIsSigningActive(true);
    }
  };

  const handleReset = () => {
    setIsSigningActive(false);
  };

  return (
    <div className="sign-page">
      <p className="page-intro">
        React reference for <code>VerdocsSign</code> — full signing experience with document fields, authentication, and
        submit. Enter signing credentials below (from your invitation, or pre-filled after sending from{" "}
        <strong>Build</strong>).
      </p>

      <ThemeBanner enabled={customThemeEnabled} onChange={setCustomThemeEnabled} variant="sign" />

      <section className="section">
        <div className="section-header">
          <h2>Signing credentials</h2>
          <p>
            <code>VerdocsSign</code> requires <code>envelopeId</code>, <code>roleId</code>, and <code>inviteCode</code>{" "}
            from the signer invitation — not builder API credentials.
          </p>
        </div>
        <div className="section-body">
          <SigningCredentialsForm
            envelopeId={envelopeId}
            roleId={roleId}
            inviteCode={inviteCode}
            partialFromSend={partialFromSend}
            isSigningActive={isSigningActive}
            onEnvelopeIdChange={setEnvelopeId}
            onRoleIdChange={setRoleId}
            onInviteCodeChange={setInviteCode}
            onStartSigning={handleStartSigning}
            onReset={handleReset}
          />
        </div>
      </section>

      <section className={`section section--sign ${customThemeEnabled ? "section--themed" : ""}`}>
        <div className="section-header">
          <h2>
            Envelope signing
            {customThemeEnabled && <span className="step-badge step-badge--theme">themed</span>}
          </h2>
          <p>
            The embed creates its own signing session. Optional <code>headerTargetId</code> moves the toolbar into the
            host slot above.
          </p>
        </div>
        <div className="section-body section-body--sign">
          {!isSigningActive && (
            <p className="sign-embed-placeholder">Click &quot;Start signing&quot; above to load the embed.</p>
          )}
          <SignPanel params={signingParams} active={isSigningActive} />
        </div>
      </section>
    </div>
  );
};
