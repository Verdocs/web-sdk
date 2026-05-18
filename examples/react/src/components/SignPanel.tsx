import {VerdocsSign} from '@verdocs/web-sdk-react';
import type {SigningParams} from '../lib/signingSession';
import {createLogEntry, type LogEntry} from '../lib/eventLog';

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
          onLog(
            createLogEntry(
              'envelopeLoaded',
              `Envelope loaded: ${e.detail.envelope.name ?? params.envelopeId}`,
              e.detail,
            ),
          );
        }}
        onEnvelopeUpdated={e => {
          onLog(
            createLogEntry(
              'envelopeUpdated',
              `Envelope updated (${e.detail.event}): status ${e.detail.envelope.status}`,
              e.detail,
            ),
          );
        }}
        onSdkError={e => {
          onLog(createLogEntry('sdkError', e.detail.message ?? 'SDK error', e.detail));
        }}
      />
    </div>
  );
};
