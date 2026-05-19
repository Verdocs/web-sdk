import {VerdocsSign} from '@verdocs/web-sdk-react';
import type {IEnvelope} from '@verdocs/js-sdk';
import type {SigningParams} from '../../lib/signingSession';
import {createLogEntry, type LogEntry} from '../../lib/eventLog';

interface SignPanelProps {
  params: SigningParams | null;
  active: boolean;
  onLog: (entry: LogEntry) => void;
}

export const SignPanel = ({params, active, onLog}: SignPanelProps) => {
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
        onEnvelopeLoaded={e => {
          const detail = (e as CustomEvent<{envelope: IEnvelope}>).detail;
          onLog(
            createLogEntry(
              'envelopeLoaded',
              `Envelope loaded: ${detail.envelope.name ?? params.envelopeId}`,
              detail,
            ),
          );
        }}
        onEnvelopeUpdated={e => {
          const detail = (e as CustomEvent<{envelope: IEnvelope; event: string}>).detail;
          onLog(
            createLogEntry(
              'envelopeUpdated',
              `Envelope updated (${detail.event}): status ${detail.envelope.status}`,
              detail,
            ),
          );
        }}
        onSdkError={e => {
          const detail = (e as CustomEvent<{message?: string}>).detail;
          onLog(createLogEntry('sdkError', detail.message ?? 'SDK error', detail));
        }}
      />
    </div>
  );
};
