import { VerdocsBuild } from "@verdocs/web-sdk-react";
import type { ICreateEnvelopeRecipientFromTemplate, IEnvelope } from "@verdocs/js-sdk";
import type { TVerdocsBuildStep } from "../../lib/buildStorage";
import { saveSigningContext } from "../../lib/signingSession";

interface VerdocsBuildSendDetail {
  recipients: ICreateEnvelopeRecipientFromTemplate[];
  name: string;
  template_id: string;
  envelope_id: string;
  envelope: IEnvelope;
}

interface VerdocsBuildPanelProps {
  templateId: string;
  step: TVerdocsBuildStep;
  onStepChange: (step: TVerdocsBuildStep) => void;
}

export const VerdocsBuildPanel = ({ templateId, step, onStepChange }: VerdocsBuildPanelProps) => {
  console.log("Is it here? ", templateId);

  return (
    <div className="build-panel">
      <VerdocsBuild
        templateId={templateId}
        step={step}
        onStepChanged={(e) => {
          const stepDetail = (e as CustomEvent<TVerdocsBuildStep>).detail;
          onStepChange(stepDetail);
        }}
        onSend={(e) => {
          const detail = (e as CustomEvent<VerdocsBuildSendDetail>).detail;
          saveSigningContext(detail.envelope_id, detail.envelope);
        }}
      />
    </div>
  );
};
