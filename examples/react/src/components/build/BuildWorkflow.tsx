import { VerdocsTemplateCreate } from "@verdocs/web-sdk-react";
import type { TVerdocsBuildStep } from "../../lib/buildStorage";
import { saveStoredTemplateId } from "../../lib/authSession";
import { VerdocsBuildPanel } from "./VerdocsBuildPanel";

interface BuildWorkflowProps {
  templateId: string | null;
  step: TVerdocsBuildStep;
  onTemplateIdChange: (id: string | null) => void;
  onStepChange: (step: TVerdocsBuildStep) => void;
}

export const BuildWorkflow = ({ templateId, step, onTemplateIdChange, onStepChange }: BuildWorkflowProps) => {
  if (!templateId) {
    return (
      <div className="create-panel">
        <VerdocsTemplateCreate
          onTemplateCreated={(e) => {
            const detail = (e as CustomEvent<{ templateId: string }>).detail;
            const id = detail.templateId;
            saveStoredTemplateId(id);
            onTemplateIdChange(id);
          }}
        />
      </div>
    );
  }

  return <VerdocsBuildPanel templateId={templateId} step={step} onStepChange={onStepChange} />;
};
