import type {IEnvelope, IRecipient} from '@verdocs/js-sdk';

export interface SigningParams {
  envelopeId: string;
  roleId: string;
  inviteCode: string;
}

const STORAGE_KEY = 'verdocs-example-signing-context';

export interface SigningContext {
  envelopeId: string;
  roleId: string | null;
  inviteCode: string | null;
  source: 'send';
}

interface RecipientWithInvite extends IRecipient {
  invite_code?: string;
  inviteCode?: string;
  invitation_code?: string;
}

const extractInviteCode = (recipient: RecipientWithInvite): string | null => {
  const code = recipient.invite_code ?? recipient.inviteCode ?? recipient.invitation_code;
  return code?.trim() ? code.trim() : null;
};

const pickSignerRecipient = (recipients: IRecipient[]): IRecipient | undefined => {
  if (!recipients.length) {
    return undefined;
  }
  const withRoleType = recipients as Array<IRecipient & {role_type?: string}>;
  const signers = withRoleType.filter(r => r.role_type === 'signer');
  return signers[0] ?? recipients[0];
};

export const saveSigningContext = (envelopeId: string, envelope: IEnvelope): void => {
  const recipient = pickSignerRecipient(envelope.recipients ?? []);
  const context: SigningContext = {
    envelopeId,
    roleId: recipient?.role_name?.trim() || null,
    inviteCode: recipient ? extractInviteCode(recipient as RecipientWithInvite) : null,
    source: 'send',
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  } catch {
    // sessionStorage may be unavailable in private browsing
  }
};

export const loadSigningContext = (): SigningContext | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as SigningContext;
  } catch {
    return null;
  }
};

export const clearSigningContext = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
