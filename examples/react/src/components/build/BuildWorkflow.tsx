import {VerdocsTemplateCreate} from '@verdocs/web-sdk-react';
import type {TVerdocsBuildStep} from '../../lib/buildStorage';
import {createLogEntry, type LogEntry} from '../../lib/eventLog';
import {saveStoredTemplateId} from '../../lib/authSession';
import {VerdocsBuildPanel} from './VerdocsBuildPanel';

interface BuildWorkflowProps {
  templateId: string | null;
  step: TVerdocsBuildStep;
  onTemplateIdChange: (id: string | null) => void;
  onStepChange: (step: TVerdocsBuildStep) => void;
  onLog: (entry: LogEntry) => void;
}

export const BuildWorkflow = ({templateId, step, onTemplateIdChange, onStepChange, onLog}: BuildWorkflowProps) => {
  if (!templateId) {
    return (
      <div className="create-panel">
        <VerdocsTemplateCreate
          onTemplateCreated={e => {
            const detail = (e as CustomEvent<{templateId: string}>).detail;
            const id = detail.templateId;
            saveStoredTemplateId(id);
            onTemplateIdChange(id);
            onLog(
              createLogEntry(
                'templateCreated',
                `Template created: ${id}. Opening VerdocsBuild at attachments step.`,
                detail,
              ),
            );
          }}
          onSdkError={e => {
            const detail = (e as CustomEvent<{message?: string}>).detail;
            onLog(createLogEntry('sdkError', detail.message ?? 'SDK error', detail));
          }}
          onExit={() => {
            onLog(createLogEntry('exit', 'User cancelled template creation.'));
          }}
        />
      </div>
    );
  }

  return (
    <VerdocsBuildPanel templateId={templateId} step={step} onStepChange={onStepChange} onLog={onLog} />
  );
};
