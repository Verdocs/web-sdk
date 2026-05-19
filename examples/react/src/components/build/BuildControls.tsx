import {useEffect, useState} from 'react';
import {BUILD_STEPS, type TVerdocsBuildStep} from '../../lib/buildStorage';

interface BuildControlsProps {
  templateId: string | null;
  step: TVerdocsBuildStep;
  templateIdInput: string;
  onTemplateIdInputChange: (value: string) => void;
  onUseTemplate: () => void;
  onStepChange: (step: TVerdocsBuildStep) => void;
  onNewTemplate: () => void;
}

export const BuildControls = ({
  templateId,
  step,
  templateIdInput,
  onTemplateIdInputChange,
  onUseTemplate,
  onStepChange,
  onNewTemplate,
}: BuildControlsProps) => {
  const [localStep, setLocalStep] = useState<TVerdocsBuildStep>(step);

  useEffect(() => {
    setLocalStep(step);
  }, [step]);

  const handleStepSelect = (value: string) => {
    const next = value as TVerdocsBuildStep;
    setLocalStep(next);
    onStepChange(next);
  };

  return (
    <div className="build-toolbar" role="region" aria-label="VerdocsBuild configuration">
      <div className="build-toolbar-field">
        <label htmlFor="build-template-id">Template ID</label>
        <input
          id="build-template-id"
          type="text"
          placeholder="UUID of existing template"
          value={templateIdInput}
          onChange={e => onTemplateIdInputChange(e.target.value)}
        />
      </div>
      <div className="build-toolbar-field">
        <label htmlFor="build-step">Step</label>
        <select
          id="build-step"
          value={localStep}
          disabled={!templateId}
          onChange={e => handleStepSelect(e.target.value)}
        >
          {BUILD_STEPS.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="build-toolbar-actions">
        <button type="button" className="build-toolbar-btn build-toolbar-btn--primary" onClick={onUseTemplate}>
          Use template
        </button>
        <button
          type="button"
          className="build-toolbar-btn build-toolbar-btn--secondary"
          onClick={onNewTemplate}
          disabled={!templateId}
        >
          New template
        </button>
      </div>
    </div>
  );
};
