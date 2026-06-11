/**
 * Prevent Jest from importing the real tinybase (which uses un-transpiled ESM "export" syntax
 * and calls store.delTables/delValues() on import).
 */
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

jest.mock('../../../../utils/Toast', () => ({
  VerdocsToast: jest.fn(),
}));

jest.mock('@verdocs/js-sdk', () => ({
  getEnvelope: jest.fn(),
  getDocumentDownloadLink: jest.fn(),
  getEnvelopeDocumentDownloadLink: jest.fn(),
  getCombinedEnvelopeDocumentDownloadLink: jest.fn(),
  getEnvelopesZip: jest.fn(),
  cancelEnvelope: jest.fn(),
  getMyRecipient: jest.fn(),
  integerSequence: jest.fn((start: number, end: number) => {
    const sequence: number[] = [];
    for (let page = start; page <= end; page += 1) {
      sequence.push(page);
    }
    return sequence;
  }),
  userCanCancelEnvelope: jest.fn(() => false),
  VerdocsEndpoint: {
    getDefault: jest.fn(() => ({
      loadSession: jest.fn(),
      profile: {},
      session: {},
    })),
  },
}));

import {h} from '@stencil/core';
import {newSpecPage} from '@stencil/core/testing';
import {
  cancelEnvelope,
  getCombinedEnvelopeDocumentDownloadLink,
  getEnvelope,
  getEnvelopeDocumentDownloadLink,
  getEnvelopesZip,
  getMyRecipient,
  VerdocsEndpoint,
} from '@verdocs/js-sdk';
import {Store} from '../../../../utils/Datastore';
import {VerdocsToast} from '../../../../utils/Toast';
import {DownloadAction} from '../../../../utils/Types';
import {VerdocsView} from '../verdocs-view';

const attachmentDocument = {
  id: 'doc-1',
  name: 'Contract.pdf',
  type: 'attachment',
  pages: 2,
  page_sizes: {
    1: {width: 612, height: 792},
    2: {width: 612, height: 792},
  },
};

const certificateDocument = {
  id: 'cert-1',
  name: 'Certificate',
  type: 'certificate',
  pages: 1,
};

const mockEnvelope = {
  id: 'env-1',
  name: 'Test Envelope',
  status: 'complete',
  signed: true,
  documents: [attachmentDocument, certificateDocument],
  recipients: [{status: 'submitted'}],
};

const mockEndpoint = {
  loadSession: jest.fn(),
  profile: {},
  session: {},
};

interface CreatePageOptions {
  envelopeId?: string;
  headerTargetId?: string;
  loadEnvelope?: boolean;
}

const createPage = async (options: CreatePageOptions = {}) => {
  const shouldLoad = options.loadEnvelope ?? false;

  return newSpecPage({
    components: [VerdocsView],
    template: () => (
      <verdocs-view
        envelope-id={shouldLoad ? (options.envelopeId ?? 'env-1') : ''}
        header-target-id={options.headerTargetId}
      ></verdocs-view>
    ),
  });
};

const loadEnvelopeView = async (options: CreatePageOptions = {}, envelope = mockEnvelope) => {
  const page = await createPage(options);
  const instance = page.rootInstance as VerdocsView;

  instance.envelopeId = options.envelopeId ?? 'env-1';
  instance.loading = false;
  instance.envelope = envelope as any;
  await page.waitForChanges();

  return {page, instance};
};

describe('verdocs-view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    Store.store.delTables();
    (VerdocsEndpoint.getDefault as jest.Mock).mockReturnValue(mockEndpoint);
    (getEnvelope as jest.Mock).mockResolvedValue(mockEnvelope);
    (getMyRecipient as jest.Mock).mockReturnValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('render', () => {
    it('renders a loader while the envelope is loading', async () => {
      const page = await createPage();
      const instance = page.rootInstance as VerdocsView;
      const expected = 'VERDOCS-LOADER';

      instance.loading = true;
      await page.waitForChanges();

      expect(page.root.querySelector('verdocs-loader')?.tagName).toBe(expected);
    });

    it('renders the load error dialog when showLoadError is true', async () => {
      const page = await createPage();
      const instance = page.rootInstance as VerdocsView;
      const expected = 'Unable to View Envelope';

      instance.loading = false;
      instance.showLoadError = true;
      await page.waitForChanges();

      expect(page.root.querySelector('verdocs-ok-dialog')?.getAttribute('heading')).toBe(expected);
    });

    it('renders a placeholder image when loading finished without an envelope', async () => {
      const page = await createPage();
      const instance = page.rootInstance as VerdocsView;
      const expected = 'Placeholder page';

      instance.loading = false;
      instance.envelope = null;
      await page.waitForChanges();

      expect(page.root.querySelector('img')?.getAttribute('alt')).toBe(expected);
    });

    it('renders the envelope toolbar and document pages when loaded', async () => {
      const {page} = await loadEnvelopeView();
      const expected = {
        title: mockEnvelope.name,
        pageCount: 2,
        zoomClass: 'zoom-normal',
      };

      expect(page.root.querySelector('.title')?.textContent).toBe(expected.title);
      expect(page.root.querySelectorAll('verdocs-envelope-document-page').length).toBe(expected.pageCount);
      expect(page.root.querySelector('.document')?.classList.contains(expected.zoomClass)).toBe(true);
    });

    it('renders the sign footer when the session user is a recipient', async () => {
      (getMyRecipient as jest.Mock).mockReturnValue({id: 'recipient-1'});
      const {page} = await loadEnvelopeView();
      const expected = 1;

      expect(page.root.querySelectorAll('verdocs-sign-footer').length).toBe(expected);
    });

    it('does not render certificate documents as pages', async () => {
      const {page} = await loadEnvelopeView();
      const expected = 2;

      expect(page.root.querySelectorAll('verdocs-envelope-document-page').length).toBe(expected);
      expect(page.root.querySelectorAll('verdocs-envelope-document-page[certificate]').length).toBe(0);
    });
  });

  describe('componentWillLoad', () => {
    it('renders without an envelope id and skips envelope loading', async () => {
      await createPage({envelopeId: ''});
      const expected = 0;

      expect(getEnvelope).toHaveBeenCalledTimes(expected);
    });

    it('initializes the default endpoint when none is provided', async () => {
      await createPage();
      const expected = 1;

      expect(VerdocsEndpoint.getDefault).toHaveBeenCalledTimes(expected);
      expect(mockEndpoint.loadSession).toHaveBeenCalledTimes(expected);
    });

    it('loads the envelope when an envelope id is provided', async () => {
      await createPage({envelopeId: 'env-1', loadEnvelope: true});
      const expected = 0;

      expect(getEnvelope).toHaveBeenCalled();
      expect((getEnvelope as jest.Mock).mock.calls.length).toBeGreaterThan(expected);
    });

    it('sets showLoadError when getEnvelope fails during initial load', async () => {
      (getEnvelope as jest.Mock).mockRejectedValue({
        message: 'Envelope not found',
        response: {status: 404, data: {error: 'missing'}},
      });

      const page = await createPage({envelopeId: 'env-1', loadEnvelope: true});
      await page.waitForChanges();

      const instance = page.rootInstance as VerdocsView;
      const expected = true;

      expect(instance.showLoadError).toBe(expected);
    });
  });

  describe('zoom controls', () => {
    it('zooms in from normal to zoom1 to zoom2', async () => {
      const {instance} = await loadEnvelopeView();
      const expected = ['zoom1', 'zoom2'];

      instance.handleZoomIn();
      expect(instance.zoomLevel).toBe(expected[0]);

      instance.handleZoomIn();
      expect(instance.zoomLevel).toBe(expected[1]);
    });

    it('does not zoom in beyond zoom2', async () => {
      const {instance} = await loadEnvelopeView();
      const expected = 'zoom2';

      instance.zoomLevel = 'zoom2';
      instance.handleZoomIn();

      expect(instance.zoomLevel).toBe(expected);
    });

    it('zooms out from zoom2 to zoom1 to normal', async () => {
      const {instance} = await loadEnvelopeView();
      const expected = ['zoom1', 'normal'];

      instance.zoomLevel = 'zoom2';
      instance.handleZoomOut();
      expect(instance.zoomLevel).toBe(expected[0]);

      instance.handleZoomOut();
      expect(instance.zoomLevel).toBe(expected[1]);
    });

    it('does not zoom out below normal', async () => {
      const {instance} = await loadEnvelopeView();
      const expected = 'normal';

      instance.handleZoomOut();

      expect(instance.zoomLevel).toBe(expected);
    });

    it('updates zoom level based on window width', async () => {
      const {instance} = await loadEnvelopeView();
      const expected = ['zoom2', 'zoom1', 'normal'];

      Object.defineProperty(window, 'innerWidth', {configurable: true, value: 500});
      instance.updateZoomFromWindow();
      expect(instance.zoomLevel).toBe(expected[0]);

      Object.defineProperty(window, 'innerWidth', {configurable: true, value: 900});
      instance.updateZoomFromWindow();
      expect(instance.zoomLevel).toBe(expected[1]);

      Object.defineProperty(window, 'innerWidth', {configurable: true, value: 1200});
      instance.updateZoomFromWindow();
      expect(instance.zoomLevel).toBe(expected[2]);
    });

    it('disables zoom buttons at the minimum and maximum zoom levels', async () => {
      const {page, instance} = await loadEnvelopeView();
      const expected = {
        minusDisabled: true,
        plusDisabled: false,
      };

      instance.zoomLevel = 'normal';
      await page.waitForChanges();
      expect(page.root.querySelector('.icon-button.minus')?.classList.contains('disabled')).toBe(expected.minusDisabled);
      expect(page.root.querySelector('.icon-button.plus')?.classList.contains('disabled')).toBe(expected.plusDisabled);

      instance.zoomLevel = 'zoom2';
      await page.waitForChanges();
      expect(page.root.querySelector('.icon-button.plus')?.classList.contains('disabled')).toBe(true);
    });
  });

  describe('handleOptionSelected', () => {
    it('opens the download dialog and starts polling when download is selected', async () => {
      const {instance} = await loadEnvelopeView({}, {
        ...mockEnvelope,
        status: 'pending',
        signed: false,
        documents: [attachmentDocument],
        recipients: [{status: 'submitted'}],
      });
      const startPollingSpy = jest.spyOn(instance, 'startPolling');
      const expected = {
        showDownloadDialog: true,
        pollingStarted: 1,
      };

      await instance.handleOptionSelected({detail: {id: 'download'}});

      expect(instance.showDownloadDialog).toBe(expected.showDownloadDialog);
      expect(startPollingSpy).toHaveBeenCalledTimes(expected.pollingStarted);
    });

    it('prints the page and emits envelopeUpdated when print is selected', async () => {
      const {page, instance} = await loadEnvelopeView();
      const printMock = jest.fn();
      Object.defineProperty(window, 'print', {configurable: true, value: printMock});
      const envelopeUpdatedSpy = jest.fn();
      page.root.addEventListener('envelopeUpdated', envelopeUpdatedSpy);
      const expected = {
        callCount: 1,
        event: 'printed',
      };

      await instance.handleOptionSelected({detail: {id: 'print'}});

      expect(printMock).toHaveBeenCalledTimes(expected.callCount);
      expect(envelopeUpdatedSpy).toHaveBeenCalledTimes(expected.callCount);
      expect(envelopeUpdatedSpy.mock.calls[0][0].detail.event).toBe(expected.event);
    });

    it('downloads the first attachment in a new tab', async () => {
      const {instance} = await loadEnvelopeView();
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      (getEnvelopeDocumentDownloadLink as jest.Mock).mockResolvedValue('https://example.com/doc.pdf');
      const expected = {
        url: 'https://example.com/doc.pdf',
        target: '_blank',
      };

      await instance.handleOptionSelected({detail: {id: 'download-attachments'}});

      expect(getEnvelopeDocumentDownloadLink).toHaveBeenCalledWith(mockEndpoint, attachmentDocument.id);
      expect(openSpy).toHaveBeenCalledWith(expected.url, expected.target);

      openSpy.mockRestore();
    });

    it('shows a toast when attachment download fails', async () => {
      const {instance} = await loadEnvelopeView();
      (getEnvelopeDocumentDownloadLink as jest.Mock).mockRejectedValue({
        response: {data: {error: 'Download failed'}},
      });
      const expected = 'Download failed';

      await instance.handleOptionSelected({detail: {id: 'download-attachments'}});

      expect(VerdocsToast).toHaveBeenCalledWith(expected, {style: 'error'});
    });

    it('downloads the certificate document when selected', async () => {
      const {instance} = await loadEnvelopeView();
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      (getEnvelopeDocumentDownloadLink as jest.Mock).mockResolvedValue('https://example.com/cert.pdf');
      const expected = 'https://example.com/cert.pdf';

      await instance.handleOptionSelected({detail: {id: 'download-certificate'}});

      expect(getEnvelopeDocumentDownloadLink).toHaveBeenCalledWith(mockEndpoint, certificateDocument.id);
      expect(openSpy).toHaveBeenCalledWith(expected, '_blank');

      openSpy.mockRestore();
    });

    it('emits envelopeUpdated when download-all succeeds', async () => {
      const {page, instance} = await loadEnvelopeView();
      const envelopeUpdatedSpy = jest.fn();
      page.root.addEventListener('envelopeUpdated', envelopeUpdatedSpy);
      (getEnvelopesZip as jest.Mock).mockResolvedValue({});
      const expected = 'downloaded';

      await instance.handleOptionSelected({detail: {id: 'download-all'}});
      await Promise.resolve();

      expect(envelopeUpdatedSpy.mock.calls[0][0].detail.event).toBe(expected);
    });

    it('cancels the envelope when the user confirms', async () => {
      const {page, instance} = await loadEnvelopeView();
      (global as any).confirm = jest.fn(() => true);
      (cancelEnvelope as jest.Mock).mockResolvedValue({});
      (getEnvelope as jest.Mock).mockResolvedValue({...mockEnvelope, status: 'canceled'});
      const envelopeUpdatedSpy = jest.fn();
      page.root.addEventListener('envelopeUpdated', envelopeUpdatedSpy);
      const expected = {
        showCancelDone: true,
        event: 'canceled',
      };

      await instance.handleOptionSelected({detail: {id: 'cancel'}});

      expect(instance.showCancelDone).toBe(expected.showCancelDone);
      expect(cancelEnvelope).toHaveBeenCalledWith(mockEndpoint, 'env-1');
      expect(envelopeUpdatedSpy.mock.calls[0][0].detail.event).toBe(expected.event);
    });

    it('does not cancel the envelope when the user declines confirmation', async () => {
      const {instance} = await loadEnvelopeView();
      (global as any).confirm = jest.fn(() => false);
      const expected = 0;

      await instance.handleOptionSelected({detail: {id: 'cancel'}});

      expect(cancelEnvelope).toHaveBeenCalledTimes(expected);
      expect(instance.showCancelDone).toBe(false);
    });
  });

  describe('startPolling and stopPolling', () => {
    it('starts polling when recipients submitted but certificate is not ready', async () => {
      const {instance} = await loadEnvelopeView({}, {
        ...mockEnvelope,
        status: 'pending',
        signed: false,
        documents: [attachmentDocument],
        recipients: [{status: 'submitted'}],
      });
      const intervalSpy = jest.spyOn(global, 'setInterval');
      const expected = true;

      instance.startPolling();

      expect(instance.polling).toBe(expected);
      expect(intervalSpy).toHaveBeenCalledTimes(1);

      intervalSpy.mockRestore();
      instance.stopPolling();
    });

    it('does not start polling when the envelope is already complete with a certificate', async () => {
      const {instance} = await loadEnvelopeView();
      const intervalSpy = jest.spyOn(global, 'setInterval');
      const expected = false;

      instance.startPolling();

      expect(instance.polling).toBe(expected);
      expect(intervalSpy).toHaveBeenCalledTimes(0);

      intervalSpy.mockRestore();
    });

    it('does not start polling when recipients have not all submitted', async () => {
      const {instance} = await loadEnvelopeView({}, {
        ...mockEnvelope,
        status: 'pending',
        signed: false,
        documents: [attachmentDocument],
        recipients: [{status: 'pending'}],
      });
      const expected = false;

      instance.startPolling();

      expect(instance.polling).toBe(expected);
    });

    it('refreshes the envelope on each polling interval', async () => {
      const updatedEnvelope = {...mockEnvelope, signed: true};
      (getEnvelope as jest.Mock).mockResolvedValue(updatedEnvelope);
      const {instance} = await loadEnvelopeView({}, {
        ...mockEnvelope,
        status: 'pending',
        signed: false,
        documents: [attachmentDocument],
        recipients: [{status: 'submitted'}],
      });
      jest.useFakeTimers();
      const expected = updatedEnvelope;

      try {
        instance.startPolling();
        await Promise.resolve();
        jest.advanceTimersByTime(5000);
        await Promise.resolve();

        expect(getEnvelope).toHaveBeenCalled();
        expect(instance.envelope).toEqual(expected);
      } finally {
        instance.stopPolling();
        jest.useRealTimers();
      }
    });

    it('stops polling when the interval is cleared', async () => {
      const {instance} = await loadEnvelopeView({}, {
        ...mockEnvelope,
        status: 'pending',
        signed: false,
        documents: [attachmentDocument],
        recipients: [{status: 'submitted'}],
      });
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      const expected = false;

      instance.startPolling();
      instance.stopPolling();

      expect(instance.polling).toBe(expected);
      expect(clearIntervalSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
    });
  });

  describe('handleDownloadDocuments', () => {
    it('opens the certificate download link', async () => {
      const {instance} = await loadEnvelopeView();
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      (getEnvelopeDocumentDownloadLink as jest.Mock).mockResolvedValue('https://example.com/cert.pdf');
      const expected = 'https://example.com/cert.pdf';

      await instance.handleDownloadDocuments({
        detail: {action: DownloadAction.certificate},
      } as any);

      expect(openSpy).toHaveBeenCalledWith(expected, '_blank');

      openSpy.mockRestore();
    });

    it('shows an info toast when the certificate is not available', async () => {
      const {instance} = await loadEnvelopeView({}, {
        ...mockEnvelope,
        documents: [attachmentDocument],
      });
      const expected = 'Certificate not yet available.';

      await instance.handleDownloadDocuments({
        detail: {action: DownloadAction.certificate},
      } as any);

      expect(VerdocsToast).toHaveBeenCalledWith(expected, {style: 'info'});
    });

    it('opens the combined document download link', async () => {
      const {instance} = await loadEnvelopeView();
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      (getCombinedEnvelopeDocumentDownloadLink as jest.Mock).mockResolvedValue('https://example.com/combined.pdf');
      const expected = 'https://example.com/combined.pdf';

      await instance.handleDownloadDocuments({
        detail: {action: DownloadAction.combined, documentId: certificateDocument.id},
      } as any);

      expect(getCombinedEnvelopeDocumentDownloadLink).toHaveBeenCalledWith(mockEndpoint, certificateDocument.id);
      expect(openSpy).toHaveBeenCalledWith(expected, '_blank');

      openSpy.mockRestore();
    });

    it('opens the attachment download link for a document action', async () => {
      const {instance} = await loadEnvelopeView();
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      (getEnvelopeDocumentDownloadLink as jest.Mock).mockResolvedValue('https://example.com/doc.pdf');
      const expected = 'https://example.com/doc.pdf';

      await instance.handleDownloadDocuments({
        detail: {action: DownloadAction.document, documentId: attachmentDocument.id},
      } as any);

      expect(getEnvelopeDocumentDownloadLink).toHaveBeenCalledWith(mockEndpoint, attachmentDocument.id);
      expect(openSpy).toHaveBeenCalledWith(expected, '_blank');

      openSpy.mockRestore();
    });

    it('downloads a zip file when the zip action is selected', async () => {
      const {instance} = await loadEnvelopeView();
      const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      const createObjectUrlSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:zip');
      const revokeObjectUrlSpy = jest.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});
      (getEnvelopesZip as jest.Mock).mockResolvedValue({data: new Blob(['zip'])});
      const expected = 1;

      await instance.handleDownloadDocuments({
        detail: {action: DownloadAction.zip},
      } as any);

      expect(getEnvelopesZip).toHaveBeenCalledWith(mockEndpoint, ['env-1']);
      expect(clickSpy).toHaveBeenCalledTimes(expected);
      expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:zip');

      clickSpy.mockRestore();
      createObjectUrlSpy.mockRestore();
      revokeObjectUrlSpy.mockRestore();
    });

    it('shows an error toast when a download request fails', async () => {
      const {instance} = await loadEnvelopeView();
      (getEnvelopeDocumentDownloadLink as jest.Mock).mockRejectedValue(new Error('network error'));
      const expected = 'Unable to complete download request.';

      await instance.handleDownloadDocuments({
        detail: {action: DownloadAction.document, documentId: attachmentDocument.id},
      } as any);

      expect(VerdocsToast).toHaveBeenCalledWith(expected, {style: 'error'});
    });
  });

  describe('download dialog interactions', () => {
    it('shows the download dialog when the toolbar download button is clicked', async () => {
      const {page, instance} = await loadEnvelopeView({}, {
        ...mockEnvelope,
        status: 'pending',
        signed: false,
        documents: [attachmentDocument],
        recipients: [{status: 'submitted'}],
      });
      const expected = true;

      page.root.querySelector('.icon-button.download')?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await page.waitForChanges();

      expect(instance.showDownloadDialog).toBe(expected);
      expect(page.root.querySelector('verdocs-download-dialog')).toBeTruthy();
    });

    it('closes the download dialog and stops polling on exit', async () => {
      const {page, instance} = await loadEnvelopeView({}, {
        ...mockEnvelope,
        status: 'pending',
        signed: false,
        documents: [attachmentDocument],
        recipients: [{status: 'submitted'}],
      });
      const stopPollingSpy = jest.spyOn(instance, 'stopPolling');
      const expected = {
        showDownloadDialog: false,
        stopPollingCalls: 1,
      };

      instance.showDownloadDialog = true;
      instance.polling = true;
      await page.waitForChanges();

      instance.showDownloadDialog = false;
      instance.stopPolling();
      await page.waitForChanges();

      expect(instance.showDownloadDialog).toBe(expected.showDownloadDialog);
      expect(stopPollingSpy).toHaveBeenCalledTimes(expected.stopPollingCalls);
    });
  });

  describe('headerTargetId', () => {
    it('adds top padding when a header target id is provided', async () => {
      const {page} = await loadEnvelopeView({headerTargetId: 'external-header'});
      const expected = '70px';

      expect(page.root.querySelector('.document')?.getAttribute('style')).toContain(expected);
    });
  });

  describe('disconnectedCallback', () => {
    it('stops polling when the component is disconnected', async () => {
      const {page, instance} = await loadEnvelopeView({}, {
        ...mockEnvelope,
        status: 'pending',
        signed: false,
        documents: [attachmentDocument],
        recipients: [{status: 'submitted'}],
      });
      const stopPollingSpy = jest.spyOn(instance, 'stopPolling');

      instance.startPolling();
      page.root.remove();
      await page.waitForChanges();

      const expected = false;

      expect(stopPollingSpy).toHaveBeenCalled();
      expect(instance.polling).toBe(expected);
    });
  });
});
