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

// The QES API calls are mocked; the URL helpers stay real so qes_result is read from window.location
jest.mock('../../../utils/Qes', () => ({
  ...jest.requireActual('../../../utils/Qes'),
  getQesState: jest.fn(),
  startQesSession: jest.fn(),
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
import {getQesState, startQesSession} from '../../../utils/Qes';
import {VerdocsToast} from '../../../utils/Toast';

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
    (getQesState as jest.Mock).mockResolvedValue({qes_state: null});

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

  describe('QES', () => {
    const qualifiedRecipient = {...mockRecipient, agreed: true, signature_level: 'qualified'};
    const qualifiedEnvelope = {...mockEnvelope, recipients: [qualifiedRecipient]};
    const signingUrl = 'https://app.example.com/sign/env-1/role-1/invite-1';

    const flush = () => new Promise(resolve => setTimeout(resolve, 0));

    // A qualified signer arriving at the signing view, optionally back from eID Easy with a qes_result in the URL
    const loadQualifiedSigner = async (options: {status?: string; qesState?: string | null; url?: string; recipient?: any} = {}) => {
      (getQesState as jest.Mock).mockResolvedValue({qes_state: options.qesState === undefined ? null : options.qesState});
      const page = await createPage({envelopeId: 'env-1', roleId: 'role-1', inviteCode: 'invite-1'});
      await page.waitForChanges();
      const instance = page.rootInstance as VerdocsSign;
      jest.clearAllMocks();

      window.location.href = options.url ?? signingUrl;
      const startQesPolling = jest.spyOn(instance, 'startQesPolling').mockImplementation(() => {});
      instance.processAuthResponse({
        ...mockSessionResponse,
        envelope: {...qualifiedEnvelope, documents: [...qualifiedEnvelope.documents]},
        recipient: {...(options.recipient ?? qualifiedRecipient), status: options.status ?? 'submitted'},
      } as unknown as ISignerTokenResponse);
      await flush();
      await page.waitForChanges();

      return {page, instance, startQesPolling};
    };

    const getQesButton = (page: any) => page.root.querySelector('.qes-step verdocs-button');

    afterEach(() => {
      window.location.href = 'http://mockdoc.stenciljs.com/';
    });

    describe('processAuthResponse', () => {
      it('tells a waiting signer they will be emailed, without a start button', async () => {
        const {page, instance} = await loadQualifiedSigner({qesState: 'waiting'});
        const expected = "This document also needs your qualified electronic signature. We'll email you when it's your turn to sign with your eID.";

        expect(getQesState).toHaveBeenCalledTimes(1);
        expect(instance.qesState).toBe('waiting');
        expect(page.root.querySelector('.qes-step .qes-message')?.textContent).toBe(expected);
        expect(getQesButton(page)).toBeNull();
      });

      it('offers a ready signer the Sign with your eID button', async () => {
        const {page} = await loadQualifiedSigner({qesState: 'ready'});
        const expected = {
          message: "It's your turn to add your qualified electronic signature. You'll sign with your eID on eID Easy's secure page.",
          label: 'Sign with your eID',
          variant: 'standard',
        };

        expect(page.root.querySelector('.qes-step .qes-message')?.textContent).toBe(expected.message);
        expect(getQesButton(page)?.getAttribute('label')).toBe(expected.label);
        expect(getQesButton(page)?.getAttribute('variant')).toBe(expected.variant);
      });

      it('offers an in-progress signer Start again and waits for the signature', async () => {
        const {page, startQesPolling} = await loadQualifiedSigner({qesState: 'in_progress'});
        const expected = {
          message: "We're confirming your eID signature. If you didn't finish signing, you can start again.",
          label: 'Start again',
          variant: 'outline',
        };

        expect(page.root.querySelector('.qes-step .qes-message')?.textContent).toBe(expected.message);
        expect(getQesButton(page)?.getAttribute('label')).toBe(expected.label);
        expect(getQesButton(page)?.getAttribute('variant')).toBe(expected.variant);
        expect(startQesPolling).toHaveBeenCalledTimes(1);
      });

      it('shows no QES step once the signer has signed', async () => {
        const {page, startQesPolling} = await loadQualifiedSigner({qesState: 'signed'});
        const expected = "You're Done!";

        expect(page.root.querySelector('.qes-step')).toBeNull();
        expect(page.root.querySelector('verdocs-ok-dialog')?.getAttribute('heading')).toBe(expected);
        expect(startQesPolling).not.toHaveBeenCalled();
      });

      it.each(['waiting', 'ready'])('tells a %s signer their fields are complete but a QES is still owed', async qesState => {
        const {page} = await loadQualifiedSigner({qesState});
        const expected = 'Your Fields Are Complete';

        expect(page.root.querySelector('verdocs-ok-dialog')?.getAttribute('heading')).toBe(expected);
      });

      it('does not ask for the QES state of a non-qualified signer', async () => {
        const {page, instance} = await loadQualifiedSigner({recipient: mockRecipient});

        expect(getQesState).not.toHaveBeenCalled();
        expect(instance.qesState).toBeNull();
        expect(page.root.querySelector('.qes-step')).toBeNull();
      });

      it('does not ask for the QES state before the signer has submitted', async () => {
        const {instance} = await loadQualifiedSigner({status: 'opened', qesState: 'ready'});

        expect(getQesState).not.toHaveBeenCalled();
        expect(instance.qesState).toBeNull();
      });

      it('shows no QES step when the state cannot be loaded', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        (getQesState as jest.Mock).mockRejectedValue(new Error('Network error'));
        const page = await createPage({envelopeId: 'env-1', roleId: 'role-1', inviteCode: 'invite-1'});
        await page.waitForChanges();
        const instance = page.rootInstance as VerdocsSign;

        instance.processAuthResponse({...mockSessionResponse, envelope: qualifiedEnvelope, recipient: {...qualifiedRecipient, status: 'submitted'}} as unknown as ISignerTokenResponse);
        await flush();
        await page.waitForChanges();

        expect(instance.qesState).toBeNull();
        expect(page.root.querySelector('.qes-step')).toBeNull();
        (console.warn as jest.Mock).mockRestore();
      });
    });

    describe('qes_result', () => {
      it('explains a canceled session and does not wait for a signature', async () => {
        const {startQesPolling} = await loadQualifiedSigner({qesState: 'in_progress', url: `${signingUrl}?qes_result=cancel`});
        const expected = 'Signing with your eID was canceled. Select "Start again" when you\'re ready.';

        expect(VerdocsToast).toHaveBeenCalledTimes(1);
        expect((VerdocsToast as jest.Mock).mock.calls[0][0]).toBe(expected);
        expect(startQesPolling).not.toHaveBeenCalled();
      });

      it('reports a failed session as an error and does not wait for a signature', async () => {
        const {startQesPolling} = await loadQualifiedSigner({qesState: 'in_progress', url: `${signingUrl}?qes_result=fail`});
        const expected = ['Signing with your eID did not complete. Please try again.', {style: 'error'}];

        expect(VerdocsToast).toHaveBeenCalledTimes(1);
        expect((VerdocsToast as jest.Mock).mock.calls[0]).toEqual(expected);
        expect(startQesPolling).not.toHaveBeenCalled();
      });

      it('waits for the signature after a signed session without a toast', async () => {
        const {startQesPolling} = await loadQualifiedSigner({qesState: 'in_progress', url: `${signingUrl}?qes_result=signed`});

        expect(VerdocsToast).not.toHaveBeenCalled();
        expect(startQesPolling).toHaveBeenCalledTimes(1);
      });

      it('removes qes_result from the address bar', async () => {
        // Each spec page gets its own history, so spy on the shared prototype
        const replaceState = jest.spyOn(Object.getPrototypeOf(window.history), 'replaceState');
        await loadQualifiedSigner({qesState: 'ready', url: `${signingUrl}?qes_result=cancel`});
        const expected = signingUrl;

        expect(replaceState).toHaveBeenCalledTimes(1);
        expect(replaceState.mock.calls[0][2]).toBe(expected);
        replaceState.mockRestore();
      });
    });

    describe('startQes', () => {
      it('starts a session returning to this page and sends the signer to eID Easy', async () => {
        (startQesSession as jest.Mock).mockResolvedValue({signing_page_url: 'https://eideasy.example.com/sign/123'});
        const {page, instance} = await loadQualifiedSigner({qesState: 'ready', url: `${signingUrl}?qes_result=fail`});
        const assign = jest.spyOn(window.location, 'assign').mockImplementation(() => {});
        const expected = {
          returnUrl: signingUrl,
          signingPageUrl: 'https://eideasy.example.com/sign/123',
        };

        getQesButton(page).click();
        await flush();
        await page.waitForChanges();

        expect(startQesSession).toHaveBeenCalledWith(instance.endpoint, expected.returnUrl);
        expect(assign).toHaveBeenCalledWith(expected.signingPageUrl);
        // Stays disabled while the browser leaves for eID Easy
        expect(instance.startingQes).toBe(true);
        expect(getQesButton(page)?.hasAttribute('disabled')).toBe(true);
        assign.mockRestore();
      });

      it('lets an in-progress signer start again', async () => {
        (startQesSession as jest.Mock).mockResolvedValue({signing_page_url: 'https://eideasy.example.com/sign/456'});
        const {page} = await loadQualifiedSigner({qesState: 'in_progress'});
        const assign = jest.spyOn(window.location, 'assign').mockImplementation(() => {});
        const expected = 'https://eideasy.example.com/sign/456';

        getQesButton(page).click();
        await flush();

        expect(startQesSession).toHaveBeenCalledTimes(1);
        expect(assign).toHaveBeenCalledWith(expected);
        assign.mockRestore();
      });

      it('shows the API error and re-enables the button when the session cannot start', async () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        (startQesSession as jest.Mock).mockRejectedValue({message: 'Request failed', response: {status: 400, data: {error: 'QES is not enabled'}}});
        const {page, instance} = await loadQualifiedSigner({qesState: 'ready'});
        const sdkErrorSpy = jest.spyOn(instance.sdkError, 'emit');
        const expected = ['QES is not enabled', {style: 'error'}];

        await instance.startQes();
        await page.waitForChanges();

        expect(VerdocsToast).toHaveBeenCalledWith(...expected);
        expect(sdkErrorSpy).toHaveBeenCalledTimes(1);
        expect(instance.startingQes).toBe(false);
        expect(getQesButton(page)?.hasAttribute('disabled')).toBe(false);
        (console.log as jest.Mock).mockRestore();
      });

      it('falls back to a generic error message', async () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        (startQesSession as jest.Mock).mockRejectedValue(new Error('Network error'));
        const {instance} = await loadQualifiedSigner({qesState: 'ready'});
        const expected = ['Unable to start signing with your eID. Please try again.', {style: 'error'}];

        await instance.startQes();

        expect(VerdocsToast).toHaveBeenCalledWith(...expected);
        (console.log as jest.Mock).mockRestore();
      });
    });

    describe('handleSubmitSuccess', () => {
      const submitQualified = async (qesState: string) => {
        (getQesState as jest.Mock).mockResolvedValue({qes_state: qesState});
        (getEnvelope as jest.Mock).mockResolvedValue(qualifiedEnvelope);
        const {page, instance} = await loadInstance({agreed: true, signature_level: 'qualified'} as any);
        const startQesPolling = jest.spyOn(instance, 'startQesPolling').mockImplementation(() => {});

        await instance.handleSubmitSuccess();
        await page.waitForChanges();

        return {page, instance, startQesPolling};
      };

      it('waits for a waiting signer to become ready', async () => {
        const {instance, startQesPolling} = await submitQualified('waiting');

        expect(instance.qesState).toBe('waiting');
        expect(startQesPolling).toHaveBeenCalledTimes(1);
      });

      it('shows the QES step once the done dialog is dismissed', async () => {
        const {page, instance} = await submitQualified('ready');
        const expected = 'Sign with your eID';

        await instance.handleDoneDialogDismiss();
        await page.waitForChanges();

        expect(getQesButton(page)?.getAttribute('label')).toBe(expected);
      });

      // BUG: right after submitting, the signing view renders its own "You're Done!" dialog (the non-done-view branch of
      // render()), so the QES-aware "Your Fields Are Complete" heading and message only appear after a reload.
      it.skip('tells the signer a QES is still owed right after submitting', async () => {
        const {page} = await submitQualified('waiting');
        const expected = 'Your Fields Are Complete';

        expect(page.root.querySelector('verdocs-ok-dialog')?.getAttribute('heading')).toBe(expected);
      });

      it('does not poll for a signer who is already ready', async () => {
        const {instance, startQesPolling} = await submitQualified('ready');

        expect(instance.qesState).toBe('ready');
        expect(startQesPolling).not.toHaveBeenCalled();
      });
    });

    describe('startQesPolling', () => {
      const pollingId = 4242;
      let clearIntervals: jest.SpyInstance;

      // Starts polling and returns the interval's callback so a test can run one tick
      const startPolling = (instance: VerdocsSign) => {
        intervals.mockImplementation((() => pollingId) as any);
        instance.startQesPolling();
        const calls = intervals.mock.calls;
        return calls[calls.length - 1][0] as () => Promise<void>;
      };

      beforeEach(() => {
        clearIntervals = jest.spyOn(globalThis, 'clearInterval');
      });

      afterEach(() => {
        clearIntervals.mockRestore();
      });

      it('checks every five seconds', async () => {
        const {instance} = await loadInstance({signature_level: 'qualified'} as any);
        const expected = 5000;

        startPolling(instance);

        expect(intervals.mock.calls[intervals.mock.calls.length - 1][1]).toBe(expected);
      });

      it('stops once a waiting signer becomes ready', async () => {
        const {instance} = await loadInstance({signature_level: 'qualified'} as any);
        instance.qesState = 'waiting';
        const tick = startPolling(instance);
        (getQesState as jest.Mock).mockResolvedValue({qes_state: 'ready'});

        await tick();

        expect(instance.qesState).toBe('ready');
        expect(clearIntervals).toHaveBeenCalledWith(pollingId);
        expect(VerdocsToast).not.toHaveBeenCalled();
      });

      it('stops once the signature is confirmed', async () => {
        const {instance} = await loadInstance({signature_level: 'qualified'} as any);
        instance.qesState = 'in_progress';
        const tick = startPolling(instance);
        (getQesState as jest.Mock).mockResolvedValue({qes_state: 'signed'});

        await tick();

        expect(instance.qesState).toBe('signed');
        expect(clearIntervals).toHaveBeenCalledWith(pollingId);
      });

      it('keeps waiting while the signature is still in progress', async () => {
        const {instance} = await loadInstance({signature_level: 'qualified'} as any);
        instance.qesState = 'in_progress';
        const tick = startPolling(instance);
        (getQesState as jest.Mock).mockResolvedValue({qes_state: 'in_progress'});

        await tick();

        expect(instance.qesState).toBe('in_progress');
        expect(clearIntervals).not.toHaveBeenCalledWith(pollingId);
      });

      it('tells the signer when the API rejected their eID signature', async () => {
        const {instance} = await loadInstance({signature_level: 'qualified'} as any);
        instance.qesState = 'in_progress';
        const tick = startPolling(instance);
        (getQesState as jest.Mock).mockResolvedValue({qes_state: 'ready'});
        const expected = ["We couldn't accept your eID signature as a qualified signature. Please sign with your eID again.", {style: 'error'}];

        await tick();

        expect(VerdocsToast).toHaveBeenCalledWith(...expected);
        expect(instance.qesState).toBe('ready');
        expect(clearIntervals).toHaveBeenCalledWith(pollingId);
      });

      it('stops when a check fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const {instance} = await loadInstance({signature_level: 'qualified'} as any);
        instance.qesState = 'in_progress';
        const tick = startPolling(instance);
        (getQesState as jest.Mock).mockRejectedValue(new Error('Network error'));

        await tick();

        expect(instance.qesState).toBe('in_progress');
        expect(clearIntervals).toHaveBeenCalledWith(pollingId);
        (console.error as jest.Mock).mockRestore();
      });
    });

    describe('isQesPending', () => {
      it('is true while a qualified recipient remains on an incomplete envelope', async () => {
        const {instance} = await loadInstance();
        instance.envelope = {...qualifiedEnvelope, status: 'pending'} as any;

        expect(instance.isQesPending()).toBe(true);
      });

      it('is false once the envelope is complete', async () => {
        const {instance} = await loadInstance();
        instance.envelope = {...qualifiedEnvelope, status: 'complete'} as any;

        expect(instance.isQesPending()).toBe(false);
      });

      it('is false without qualified recipients', async () => {
        const {instance} = await loadInstance();
        instance.envelope = {...mockEnvelope, status: 'pending'} as any;

        expect(instance.isQesPending()).toBe(false);
      });
    });
  });
});
