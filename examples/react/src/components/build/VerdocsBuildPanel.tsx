import {useCallback} from 'react';
import {VerdocsBuild} from '@verdocs/web-sdk-react';
import type {ICreateEnvelopeRecipientFromTemplate, IEnvelope, IRole, ITemplate} from '@verdocs/js-sdk';
import {formatRolesAsText} from '../../lib/formatRoles';
import type {TVerdocsBuildStep} from '../../lib/buildStorage';
import {createLogEntry, type LogEntry} from '../../lib/eventLog';
import {saveSigningContext} from '../../lib/signingSession';

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
  onLog: (entry: LogEntry) => void;
}

export const VerdocsBuildPanel = ({templateId, step, onStepChange, onLog}: VerdocsBuildPanelProps) => {
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
          const stepDetail = (e as CustomEvent<TVerdocsBuildStep>).detail;
          onStepChange(stepDetail);
          onLog(createLogEntry('stepChanged', `Wizard step: ${stepDetail}`));
        }}
        onTemplateUpdated={e => {
          const {template, event} = (e as CustomEvent<{template: ITemplate; event: string}>).detail;
          logTemplateRoles(template, event);
        }}
        onSend={e => {
          const detail = (e as CustomEvent<VerdocsBuildSendDetail>).detail;
          saveSigningContext(detail.envelope_id, detail.envelope);
          onLog(
            createLogEntry(
              'send',
              `Envelope sent.\ntemplate_id: ${detail.template_id}\nenvelope_id: ${detail.envelope_id}\n\nOpen the Sign tab to try VerdocsSign.`,
              detail,
            ),
          );
        }}
        onSdkError={e => {
          const detail = (e as CustomEvent<{message?: string}>).detail;
          onLog(createLogEntry('sdkError', detail.message ?? 'SDK error', detail));
        }}
        onCancel={() => {
          onLog(createLogEntry('cancel', 'User cancelled attachments or roles step.'));
        }}
      />
    </div>
  );
};
