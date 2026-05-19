import { useEffect, useMemo, useState } from "react";
import { SignPanel } from "../components/sign/SignPanel";
import { ThemeBanner } from "../components/shared/ThemeBanner";
import { loadSigningContext } from "../lib/signingSession";
import type { SigningParams } from "../lib/signingSession";
import { useExampleTheme } from "../lib/useVerdocsTheme";
import { getThemeBadgeLabel } from "../lib/themeBadge";
import NavTags from "../components/navTags/NavTags";

export const SignPage = () => {
  const [envelopeId] = useState("36ecb8e9-eea0-4eb6-b98d-f0ae86be5d22");
  const [roleId] = useState("Recipient 1");
  const [inviteCode] = useState("lecfirrf7h5bncao2ce17qd0");
  const { themeId, setThemeId, isCustomTheme } = useExampleTheme("wayfair");
  const themeBadge = getThemeBadgeLabel(themeId);

  useEffect(() => {
    const context = loadSigningContext();
    if (!context) {
      return;
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

  return (
    <div className="sign-page">
      <ThemeBanner themeId={themeId} onChange={setThemeId} variant="sign" />
      <NavTags />

      <section className={`section section--sign ${isCustomTheme ? "section--themed" : ""}`}>
        <div className="section-header">
          <h2>
            Envelope signing
            {themeBadge && <span className="step-badge step-badge--theme">{themeBadge}</span>}
          </h2>
          <p>
            The embed creates its own signing session. Optional <code>headerTargetId</code> moves the toolbar into the
            host slot above.
          </p>
        </div>
        <div className="section-body section-body--sign">
          <SignPanel params={signingParams} />
        </div>
      </section>
    </div>
  );
};
