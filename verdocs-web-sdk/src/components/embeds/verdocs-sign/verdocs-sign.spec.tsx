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
import {envelopeRecipientAgree, envelopeRecipientDecline, envelopeRecipientSubmit, getEnvelope, ISignerTokenResponse, startSigningSession} from '@verdocs/js-sdk';
import {VerdocsSign} from './verdocs-sign';

const mockRecipient = {
  role_name: 'Recipient 1',
  type: 'signer',
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
  // The missing-field check repeats every few seconds, which would keep the test run open; tests call it directly instead
  let intervals: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    intervals = jest.spyOn(globalThis, 'setInterval').mockImplementation((() => 0) as any);
    (startSigningSession as jest.Mock).mockResolvedValue(mockSessionResponse);
    (getEnvelope as jest.Mock).mockResolvedValue(mockEnvelope);
    (envelopeRecipientSubmit as jest.Mock).mockResolvedValue({});

    global.IntersectionObserver = class {
      observe() {}

      disconnect() {}

      unobserve() {}
    } as any;
  });

  afterEach(() => {
    intervals.mockRestore();
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

  describe('declining', () => {
    it('emits envelopeUpdated once the decline goes through', async () => {
      (envelopeRecipientDecline as jest.Mock).mockResolvedValue({});
      const {page, instance} = await loadSigningView();
      const envelopeUpdatedSpy = jest.spyOn(instance.envelopeUpdated, 'emit');

      instance.declining = true;
      await page.waitForChanges();
      page.root.querySelector('verdocs-ok-dialog').dispatchEvent(new CustomEvent('next'));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(envelopeRecipientDecline).toHaveBeenCalledTimes(1);
      expect(envelopeUpdatedSpy.mock.calls[0][0].event).toBe('declined');
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

  describe('approvers', () => {
    it('labels the button Approve and explains the step after the disclosures', async () => {
      (envelopeRecipientAgree as jest.Mock).mockResolvedValue({});
      const {page, instance} = await loadInstance({type: 'approver', role_name: 'Reviewer'});

      instance.handleClickAgree();
      await new Promise(resolve => setTimeout(resolve, 0));
      await page.waitForChanges();

      expect(instance.nextButtonLabel).toBe('Approve');
      expect(instance.nextSubmits).toBe(true);
      expect(page.root.querySelectorAll('verdocs-ok-dialog').length).toBe(1);
    });

    it('explains the step again when an approver returns before submitting', async () => {
      const {page, instance} = await loadInstance({type: 'approver', role_name: 'Reviewer', agreed: true});
      await page.waitForChanges();

      expect(instance.nextButtonLabel).toBe('Approve');
      expect(page.root.querySelectorAll('verdocs-ok-dialog').length).toBe(1);
    });

    it('does not show the approver dialog to signers', async () => {
      (envelopeRecipientAgree as jest.Mock).mockResolvedValue({});
      const {page, instance} = await loadInstance();

      instance.handleClickAgree();
      await new Promise(resolve => setTimeout(resolve, 0));
      await page.waitForChanges();

      expect(instance.showApproverIntro).toBe(false);
      expect(page.root.querySelectorAll('verdocs-ok-dialog').length).toBe(0);
    });
  });

  describe('checkForMissingFields', () => {
    // A page the way verdocs-envelope-document-page presents itself, with its image loaded or still loading
    const addPage = (instance: VerdocsSign, loaded: boolean) => {
      const page: any = document.createElement('verdocs-envelope-document-page');
      page.documentId = 'doc-1';
      page.pageNumber = 1;
      const image = document.createElement('img');
      Object.defineProperty(image, 'complete', {value: loaded});
      Object.defineProperty(image, 'naturalWidth', {value: loaded ? 612 : 0});
      page.appendChild(image);
      instance.el.appendChild(page);
    };

    const watch = async (loaded: boolean, submitted = false) => {
      const {instance} = await loadInstance();
      const reported = jest.fn();
      instance.fieldNotVisible = {emit: reported} as any;
      instance.submitted = submitted;
      addPage(instance, loaded);
      return {instance, reported};
    };

    it('reports a field missing from a loaded page once it stays missing through two checks', async () => {
      const {instance, reported} = await watch(true);

      instance.checkForMissingFields();
      expect(reported).not.toHaveBeenCalled();

      instance.checkForMissingFields();
      instance.checkForMissingFields();
      expect(reported).toHaveBeenCalledTimes(1);
      expect(reported).toHaveBeenCalledWith(expect.objectContaining({problem: 'never drawn', field: expect.objectContaining({name: 'signature-1'})}));
    });

    it('waits for a page whose image has not loaded yet', async () => {
      const {instance, reported} = await watch(false);

      instance.checkForMissingFields();
      instance.checkForMissingFields();

      expect(reported).not.toHaveBeenCalled();
    });

    it('stops once the signer has submitted', async () => {
      const {instance, reported} = await watch(true, true);

      instance.checkForMissingFields();
      instance.checkForMissingFields();

      expect(reported).not.toHaveBeenCalled();
    });
  });

  describe('handlePageRendered', () => {
    it('tries a field once more before reporting that it never drew', async () => {
      const {instance} = await loadInstance();
      instance.roleId = 'Recipient 1';
      const reported = jest.fn();
      instance.fieldNotVisible = {emit: reported} as any;
      const pageInfo = {
        containerId: 'no-such-page',
        documentId: 'doc-1',
        pageNumber: 1,
        naturalWidth: 612,
        naturalHeight: 792,
        renderedWidth: 612,
        renderedHeight: 792,
        xScale: 1,
        yScale: 1,
      };

      instance.handlePageRendered({detail: pageInfo});
      expect(reported).not.toHaveBeenCalled();

      await new Promise(resolve => setTimeout(resolve, 350));
      expect(reported).toHaveBeenCalledTimes(1);
      expect(reported).toHaveBeenCalledWith(
        expect.objectContaining({problem: 'not drawn', role_name: 'Recipient 1', field: expect.objectContaining({name: 'signature-1', page: 1})}),
      );
      expect(reported.mock.calls[0][0].field).not.toHaveProperty('value');
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
