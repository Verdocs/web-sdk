interface SigningCredentialsFormProps {
  envelopeId: string;
  roleId: string;
  inviteCode: string;
  partialFromSend: boolean;
  isSigningActive: boolean;
  onEnvelopeIdChange: (value: string) => void;
  onRoleIdChange: (value: string) => void;
  onInviteCodeChange: (value: string) => void;
  onStartSigning: () => void;
  onReset: () => void;
}

const isComplete = (envelopeId: string, roleId: string, inviteCode: string): boolean =>
  Boolean(envelopeId.trim() && roleId.trim() && inviteCode.trim());

export const SigningCredentialsForm = ({
  envelopeId,
  roleId,
  inviteCode,
  partialFromSend,
  isSigningActive,
  onEnvelopeIdChange,
  onRoleIdChange,
  onInviteCodeChange,
  onStartSigning,
  onReset,
}: SigningCredentialsFormProps) => {
  const canStart = isComplete(envelopeId, roleId, inviteCode);

  return (
    <form
      className="sign-credentials-form"
      onSubmit={e => {
        e.preventDefault();
        if (canStart) {
          onStartSigning();
        }
      }}
    >
      {partialFromSend && (
        <p className="sign-setup-callout-note">
          Envelope context from your last <strong>Build</strong> send is pre-filled. Add the invite code from the signer
          invitation email or URL.
        </p>
      )}

      <div className="sign-credentials-field">
        <label htmlFor="sign-envelope-id">Envelope ID</label>
        <input
          id="sign-envelope-id"
          type="text"
          value={envelopeId}
          onChange={e => onEnvelopeIdChange(e.target.value)}
          placeholder="Envelope UUID"
          autoComplete="off"
          disabled={isSigningActive}
        />
      </div>

      <div className="sign-credentials-field">
        <label htmlFor="sign-role-id">Role ID</label>
        <input
          id="sign-role-id"
          type="text"
          value={roleId}
          onChange={e => onRoleIdChange(e.target.value)}
          placeholder="e.g. Recipient 1"
          autoComplete="off"
          disabled={isSigningActive}
        />
      </div>

      <div className="sign-credentials-field">
        <label htmlFor="sign-invite-code">Invite code</label>
        <input
          id="sign-invite-code"
          type="text"
          value={inviteCode}
          onChange={e => onInviteCodeChange(e.target.value)}
          placeholder="From signing invitation"
          autoComplete="off"
          disabled={isSigningActive}
        />
      </div>

      <p className="sign-credentials-hint">
        Unlike <code>VerdocsBuild</code>, <code>VerdocsSign</code> uses the signer&apos;s invite code — not your builder
        username/password. Send from the <a href="#/build">Build</a> tab to pre-fill envelope and role.
      </p>

      <div className="sign-credentials-actions">
        <button type="submit" className="sign-credentials-submit" disabled={!canStart || isSigningActive}>
          Start signing
        </button>
        {isSigningActive && (
          <button type="button" className="sign-credentials-reset" onClick={onReset}>
            Edit credentials
          </button>
        )}
      </div>
    </form>
  );
};
