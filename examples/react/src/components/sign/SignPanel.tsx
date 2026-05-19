import { VerdocsSign } from "@verdocs/web-sdk-react";
import type { SigningParams } from "../../lib/signingSession";

interface SignPanelProps {
  params: SigningParams | null;
}

export const SignPanel = ({ params }: SignPanelProps) => {
  if (!params) {
    return null;
  }

  const sessionKey = `${params.envelopeId}-${params.roleId}-${params.inviteCode}`;

  return (
    <div className="sign-panel">
      <VerdocsSign
        key={sessionKey}
        envelopeId={params.envelopeId}
        roleId={params.roleId}
        inviteCode={params.inviteCode}
        toolbarStyle="menu"
        headerTargetId="verdocs-sign-header-host"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      />
    </div>
  );
};
