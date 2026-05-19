import { VerdocsSign } from "@verdocs/web-sdk-react";
import type { SigningParams } from "../../lib/signingSession";

interface SignPanelProps {
  params: SigningParams | null;
  active: boolean;
}

export const SignPanel = ({ params, active }: SignPanelProps) => {
  if (!active || !params) {
    return null;
  }

  const sessionKey = `${params.envelopeId}-${params.roleId}-${params.inviteCode}`;

  return (
    <div className="sign-panel">
      <div id="verdocs-sign-header-host" className="sign-header-host" />
      <VerdocsSign
        key={sessionKey}
        envelopeId={params.envelopeId}
        roleId={params.roleId}
        inviteCode={params.inviteCode}
        toolbarStyle="menu"
        headerTargetId="verdocs-sign-header-host"
      />
    </div>
  );
};
