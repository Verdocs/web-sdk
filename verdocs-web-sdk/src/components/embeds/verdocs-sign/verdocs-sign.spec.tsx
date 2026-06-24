jest.mock('tinybase', () => {
  const rows: Record<string, Record<string, unknown>> = {};

  const createMockStore = () => ({
    delTables: () => {
      Object.keys(rows).forEach(key => delete rows[key]);
    },
    delValues: () => {},
    hasRow: (tableId: string, rowId: string) => !!rows[`${tableId}:${rowId}`],
    getRow: (tableId: string, rowId: string) => rows[`${tableId}:${rowId}`] || {},
    setRow: (tableId: string, rowId: string, row: Record<string, unknown>) => {
      rows[`${tableId}:${rowId}`] = row;
    },
    addRowListener: (_tableId: string, _rowId: string, _callback: () => void) => 'listener-id',
    delListener: (_listenerId: string) => {},
  });

  return {
    createStore: createMockStore,
    Row: class {},
  };
});

jest.mock('../../../utils/Toast', () => ({
  VerdocsToast: jest.fn(),
}));

jest.mock('@verdocs/js-sdk', () => {
  const actualSdk = jest.requireActual('@verdocs/js-sdk');

  class FakeEndpoint {
    static getDefault() {
      return new FakeEndpoint();
    }

    api = {
      get: jest.fn().mockResolvedValue({}),
      post: jest.fn().mockResolvedValue({}),
      put: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };

    profile = {};
    session = {};

    loadSession() {}

    onSessionChanged() {}

    setTimeout() {}

    setBaseURL() {}

    getBaseURL() {
      return '';
    }
  }

  return {
    ...actualSdk,
    VerdocsEndpoint: FakeEndpoint,
    startSigningSession: jest.fn(),
    getEnvelope: jest.fn(),
    envelopeRecipientSubmit: jest.fn(),
    envelopeRecipientAgree: jest.fn(),
    envelopeRecipientDecline: jest.fn(),
  };
});

import {newSpecPage} from '@stencil/core/testing';
import {envelopeRecipientSubmit, getEnvelope, ISignerTokenResponse, startSigningSession} from '@verdocs/js-sdk';
import {VerdocsSign} from './verdocs-sign';

const mockRecipient = {
  role_name: 'Recipient 1',
  status: 'opened',
  agreed: false,
  auth_step: null,
};

const mockEnvelope = {
  id: 'env-1',
  name: 'Test Envelope',
  status: 'sent',
  fields: [
    {
      name: 'signature-1',
      type: 'signature',
      role_name: 'Recipient 1',
      document_id: 'doc-1',
      page: 1,
      required: true,
      value: 'sig-id',
      readonly: false,
    },
  ],
  documents: [
    {
      id: 'doc-1',
      name: 'Contract.pdf',
      type: 'attachment',
      pages: 1,
      order: 1,
      created_at: '2024-01-01T00:00:00.000Z',
      page_sizes: {
        1: {width: 612, height: 792},
      },
    },
  ],
  organization: {},
  recipients: [mockRecipient],
};

const mockSessionResponse = {
  access_token: 'test-token',
  envelope: mockEnvelope,
  recipient: mockRecipient,
  brand: null,
} as unknown as ISignerTokenResponse;

interface CreatePageOptions {
  envelopeId?: string;
  roleId?: string;
  inviteCode?: string;
}

const createPage = async (options: CreatePageOptions = {}) => {
  const envelopeId = options.envelopeId ?? '';
  const roleId = options.roleId ?? '';
  const inviteCode = options.inviteCode ?? '';

  return newSpecPage({
    components: [VerdocsSign],
    html: `<verdocs-sign envelope-id="${envelopeId}" role-id="${roleId}" invite-code="${inviteCode}"></verdocs-sign>`,
  });
};

const loadInstance = async (overrides: Partial<typeof mockRecipient> = {}) => {
  const page = await createPage({
    envelopeId: 'env-1',
    roleId: 'role-1',
    inviteCode: 'invite-1',
  });
  const instance = page.rootInstance as VerdocsSign;

  instance.processAuthResponse({
    ...mockSessionResponse,
    recipient: {...mockRecipient, ...overrides} as ISignerTokenResponse['recipient'],
  });

  return {page, instance};
};

const loadSigningView = async () => {
  const {page, instance} = await loadInstance();

  instance.agreed = true;
  await page.waitForChanges();

  return {page, instance};
};

describe('verdocs-sign', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (startSigningSession as jest.Mock).mockResolvedValue(mockSessionResponse);
    (getEnvelope as jest.Mock).mockResolvedValue(mockEnvelope);
    (envelopeRecipientSubmit as jest.Mock).mockResolvedValue({});

    global.IntersectionObserver = class {
      observe() {}

      disconnect() {}

      unobserve() {}
    } as any;
  });

  describe('componentDidLoad', () => {
    it('emits sdkError when envelopeId is missing', async () => {
      const page = await createPage();
      const instance = page.rootInstance as VerdocsSign;
      const sdkErrorSpy = jest.spyOn(instance.sdkError, 'emit');

      instance.roleId = 'role-1';
      instance.inviteCode = 'invite-1';
      await instance.componentDidLoad();

      const expected = '[SIGN] Missing required envelopId';

      expect(sdkErrorSpy.mock.calls[0][0].message).toBe(expected);
      expect(startSigningSession).not.toHaveBeenCalled();
      expect(instance.showLoadError).toBe(false);
    });

    it('shows the load error dialog when signing session initialization fails', async () => {
      (startSigningSession as jest.Mock).mockRejectedValue(new Error('Invalid invite'));
      const page = await createPage({
        envelopeId: 'env-1',
        roleId: 'role-1',
        inviteCode: 'bad-invite',
      });
      const instance = page.rootInstance as VerdocsSign;
      const expected = 'Unable to Start Signing';

      await page.waitForChanges();

      expect(instance.showLoadError).toBe(true);
      expect(page.root.querySelector('verdocs-ok-dialog')?.getAttribute('heading')).toBe(expected);
    });

    it('initializes the signing session when required props are provided', async () => {
      const page = await createPage({
        envelopeId: 'env-1',
        roleId: 'role-1',
        inviteCode: 'invite-1',
      });
      const instance = page.rootInstance as VerdocsSign;

      await page.waitForChanges();

      const expected = {
        callCount: 1,
        envelopeName: mockEnvelope.name,
      };

      expect(startSigningSession).toHaveBeenCalledTimes(expected.callCount);
      expect(instance.envelope?.name).toBe(expected.envelopeName);
    });
  });

  describe('retrySigningSession', () => {
    it('retries session initialization after a load error', async () => {
      (startSigningSession as jest.Mock)
        .mockRejectedValueOnce(new Error('Invalid invite'))
        .mockResolvedValueOnce(mockSessionResponse);

      const page = await createPage({
        envelopeId: 'env-1',
        roleId: 'role-1',
        inviteCode: 'invite-1',
      });
      const instance = page.rootInstance as VerdocsSign;

      await page.waitForChanges();
      await instance.retrySigningSession();
      await page.waitForChanges();

      const expected = {
        callCount: 2,
        showLoadError: false,
        envelopeName: mockEnvelope.name,
      };

      expect(startSigningSession).toHaveBeenCalledTimes(expected.callCount);
      expect(instance.showLoadError).toBe(expected.showLoadError);
      expect(instance.envelope?.name).toBe(expected.envelopeName);
    });
  });

  describe('processAuthResponse', () => {
    it('enters the done view when the recipient has already submitted', async () => {
      const page = await createPage();
      const instance = page.rootInstance as VerdocsSign;

      instance.processAuthResponse({
        ...mockSessionResponse,
        recipient: {...mockRecipient, status: 'submitted'} as ISignerTokenResponse['recipient'],
      });
      await page.waitForChanges();

      const expected = {
        submitted: true,
        isDone: true,
        showDone: true,
      };

      expect(instance.submitted).toBe(expected.submitted);
      expect(instance.isDone).toBe(expected.isDone);
      expect(instance.showDone).toBe(expected.showDone);
      expect(page.root.querySelector('verdocs-view')).toBeTruthy();
    });
  });

  describe('handleSubmitSuccess', () => {
    it('marks the recipient as submitted and shows the done dialog', async () => {
      const {instance} = await loadInstance();
      const envelopeUpdatedSpy = jest.spyOn(instance.envelopeUpdated, 'emit');

      await instance.handleSubmitSuccess();

      const expected = {
        submitted: true,
        showDone: true,
        nextSubmits: false,
        signingProgressMode: 'completed',
        event: 'submitted',
      };

      expect(instance.submitted).toBe(expected.submitted);
      expect(instance.showDone).toBe(expected.showDone);
      expect(instance.nextSubmits).toBe(expected.nextSubmits);
      expect(instance.signingProgressMode).toBe(expected.signingProgressMode);
      expect(envelopeUpdatedSpy.mock.calls[0][0].event).toBe(expected.event);
    });

    it('still shows the done dialog when refreshing the envelope fails', async () => {
      (getEnvelope as jest.Mock).mockRejectedValue(new Error('Network error'));
      const {instance} = await loadInstance();

      await instance.handleSubmitSuccess();

      const expected = {
        submitted: true,
        showDone: true,
      };

      expect(instance.submitted).toBe(expected.submitted);
      expect(instance.showDone).toBe(expected.showDone);
    });
  });

  describe('handleDoneDialogDismiss', () => {
    it('transitions into the done view after the dialog is dismissed', async () => {
      const {page, instance} = await loadSigningView();

      instance.submitted = true;
      instance.showDone = true;
      await page.waitForChanges();

      await instance.handleDoneDialogDismiss();

      const expected = {
        showDone: false,
        isDone: true,
      };

      expect(instance.showDone).toBe(expected.showDone);
      expect(instance.isDone).toBe(expected.isDone);
    });
  });

  describe('checkRecipientFields', () => {
    it('does not re-enable the finish button after submission', async () => {
      const {instance} = await loadInstance();

      instance.submitted = true;
      instance.nextSubmits = false;
      instance.nextButtonLabel = 'Next';
      instance.checkRecipientFields();

      const expected = {
        nextSubmits: false,
        nextButtonLabel: 'Next',
      };

      expect(instance.nextSubmits).toBe(expected.nextSubmits);
      expect(instance.nextButtonLabel).toBe(expected.nextButtonLabel);
    });
  });

  describe('handleNext', () => {
    it('does not submit again when the recipient is already submitted', async () => {
      const {instance} = await loadInstance();

      instance.nextSubmits = true;
      instance.submitted = true;
      await instance.handleNext();

      const expected = 0;

      expect(envelopeRecipientSubmit).toHaveBeenCalledTimes(expected);
    });

    it('submits the envelope when finish is clicked', async () => {
      const {instance} = await loadInstance();

      instance.nextSubmits = true;
      await instance.handleNext();

      const expected = {
        submitCallCount: 1,
        submitted: true,
        showDone: true,
      };

      expect(envelopeRecipientSubmit).toHaveBeenCalledTimes(expected.submitCallCount);
      expect(instance.submitted).toBe(expected.submitted);
      expect(instance.showDone).toBe(expected.showDone);
    });
  });

  describe('render', () => {
    it('renders the disclosure dialog before the recipient agrees', async () => {
      const {page} = await loadInstance();
      await page.waitForChanges();

      const expected = 1;

      expect(page.root.querySelectorAll('verdocs-disclosure-dialog').length).toBe(expected);
    });

    it('hides the finish button after submission', async () => {
      const {page, instance} = await loadSigningView();

      instance.toolbarStyle = 'menu';
      instance.submitted = true;
      await page.waitForChanges();

      const expected = 0;

      expect(page.root.querySelectorAll('verdocs-button').length).toBe(expected);
    });

    it('hides the sign footer after submission', async () => {
      const {page, instance} = await loadSigningView();

      instance.submitted = true;
      await page.waitForChanges();

      const expected = 0;

      expect(page.root.querySelectorAll('verdocs-sign-footer').length).toBe(expected);
    });
  });
});
