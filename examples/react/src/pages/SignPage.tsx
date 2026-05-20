import { useEffect, useMemo, useState } from "react";
import { SignWorkflow } from "../components/sign/SignWorkflow";
import { ThemeBanner } from "../components/shared/ThemeBanner";
import { loadSigningContext } from "../lib/signingSession";
import type { SigningParams } from "../lib/signingSession";
import { useExampleTheme } from "../lib/useVerdocsTheme";
import NavTags from "../components/navTags/NavTags";

export const SignPage = () => {
  const [envelopeId] = useState("36ecb8e9-eea0-4eb6-b98d-f0ae86be5d22");
  const [roleId] = useState("Recipient 1");
  const [inviteCode] = useState("lecfirrf7h5bncao2ce17qd0");
  const { themeId, setThemeId, isCustomTheme } = useExampleTheme("wayfair");

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
      <ThemeBanner themeId={themeId} onChange={setThemeId} />
      <NavTags />

      <section className={`section section--signer ${isCustomTheme ? "section--themed" : ""}`}>
        <div className="section-header">
          <h2>Envelope signing</h2>
        </div>
        <div className="section-body section-body--sign">
          <SignWorkflow params={signingParams} />
        </div>
      </section>
    </div>
  );
};
