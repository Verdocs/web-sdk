import {useCallback, useState} from 'react';
import {VerdocsBuild} from '@verdocs/web-sdk-react';
import type {IRole, ITemplate} from '@verdocs/js-sdk';
import {formatRolesAsText} from '../lib/formatRoles';
import {createLogEntry, type LogEntry} from '../lib/eventLog';

type TVerdocsBuildStep = 'attachments' | 'roles' | 'fields' | 'preview';

interface VerdocsBuildPanelProps {
  templateId: string;
  onLog: (entry: LogEntry) => void;
}

export const VerdocsBuildPanel = ({templateId, onLog}: VerdocsBuildPanelProps) => {
  const [step, setStep] = useState<TVerdocsBuildStep>('attachments');

  const logTemplateRoles = useCallback(
    (template: ITemplate | undefined, event: string) => {
      const rolesText = formatRolesAsText(template?.roles as IRole[] | undefined);
      onLog(
        createLogEntry(
          'templateUpdated',
          `Template updated (${event}). Roles by sequence/order:\n${rolesText}`,
          {event, roles: template?.roles},
        ),
      );
    },
    [onLog],
  );

  return (
    <div className="build-panel">
      <VerdocsBuild
        templateId={templateId}
        step={step}
        onStepChanged={e => {
          setStep(e.detail);
          onLog(createLogEntry('stepChanged', `Wizard step: ${e.detail}`));
        }}
        onTemplateUpdated={e => {
          logTemplateRoles(e.detail.template, e.detail.event);
        }}
        onSend={e => {
          onLog(
            createLogEntry(
              'send',
              `Envelope sent from template.\nname: ${e.detail.name}\ntemplate_id: ${e.detail.template_id}\nrecipients: ${e.detail.recipients.length}`,
              e.detail,
            ),
          );
        }}
        onSdkError={e => {
          onLog(createLogEntry('sdkError', e.detail.message ?? 'SDK error', e.detail));
        }}
        onCancel={() => {
          onLog(createLogEntry('cancel', 'User cancelled attachments or roles step.'));
        }}
      />
    </div>
  );
};
