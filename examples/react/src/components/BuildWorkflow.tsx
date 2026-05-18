import {useState} from 'react';
import {VerdocsTemplateCreate} from '@verdocs/web-sdk-react';
import {VerdocsBuildPanel} from './VerdocsBuildPanel';
import {createLogEntry, type LogEntry} from '../lib/eventLog';

interface BuildWorkflowProps {
  initialTemplateId: string | null;
  onLog: (entry: LogEntry) => void;
}

export const BuildWorkflow = ({initialTemplateId, onLog}: BuildWorkflowProps) => {
  const [templateId, setTemplateId] = useState<string | null>(initialTemplateId);

  if (!templateId) {
    return (
      <div className="create-panel">
        <VerdocsTemplateCreate
          onTemplateCreated={e => {
            const id = e.detail.templateId;
            setTemplateId(id);
            onLog(
              createLogEntry(
                'templateCreated',
                `Template created: ${id}. Opening VerdocsBuild at attachments step.`,
                e.detail,
              ),
            );
          }}
          onSdkError={e => {
            onLog(createLogEntry('sdkError', e.detail.message ?? 'SDK error', e.detail));
          }}
          onExit={() => {
            onLog(createLogEntry('exit', 'User cancelled template creation.'));
          }}
        />
      </div>
    );
  }

  return <VerdocsBuildPanel templateId={templateId} onLog={onLog} />;
};
