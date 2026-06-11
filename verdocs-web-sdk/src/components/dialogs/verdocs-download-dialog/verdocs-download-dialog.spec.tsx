import {h} from '@stencil/core';
import {newSpecPage} from '@stencil/core/testing';
import {DownloadAction} from '../../../utils/Types';
import {VerdocsDialog} from '../verdocs-dialog/verdocs-dialog';
import {VerdocsDownloadDialog} from './verdocs-download-dialog';

const attachmentOne = {
  id: 'doc-1',
  name: 'Contract.pdf',
  type: 'attachment',
  order: 1,
  created_at: '2024-01-02',
};

const attachmentTwo = {
  id: 'doc-2',
  name: 'Addendum.pdf',
  type: 'attachment',
  order: 2,
  created_at: '2024-01-01',
};

const certificateDocument = {
  id: 'cert-1',
  name: 'Certificate',
  type: 'certificate',
  order: 3,
  created_at: '2024-01-03',
};

const createPage = async (
  props: {
    signed?: boolean;
    polling?: boolean;
    documents?: any[];
    hasCertificate?: boolean;
  } = {},
) => {
  return newSpecPage({
    components: [VerdocsDownloadDialog, VerdocsDialog],
    template: () => (
      <verdocs-download-dialog
        signed={props.signed ?? false}
        polling={props.polling ?? false}
        documents={props.documents ?? []}
        hasCertificate={props.hasCertificate ?? false}
      ></verdocs-download-dialog>
    ),
  });
};

describe('verdocs-download-dialog', () => {
  describe('render', () => {
    it('renders the download heading inside the dialog', async () => {
      const page = await createPage();
      const expected = 'Download';

      expect(page.root.querySelector('h3')?.textContent).toBe(expected);
      expect(page.root.querySelector('verdocs-dialog')).toBeTruthy();
    });

    it('renders individual attachment options when two or fewer attachments exist', async () => {
      const page = await createPage({documents: [attachmentOne, attachmentTwo]});
      const expected = [attachmentOne.name, attachmentTwo.name, 'Certificate', 'All Files'];

      const labels = Array.from(page.root.querySelectorAll('.download-option .label')).map(label => label.textContent);

      expect(labels).toEqual(expected);
      expect(page.root.querySelector('.info-message')).toBeNull();
    });

    it('sorts attachments by order then created_at', async () => {
      const sameOrderEarlier = {...attachmentTwo, order: 1, created_at: '2024-01-01'};
      const sameOrderLater = {...attachmentOne, order: 1, created_at: '2024-01-02'};
      const page = await createPage({documents: [sameOrderLater, sameOrderEarlier]});
      const expected = sameOrderEarlier.name;

      expect(page.root.querySelectorAll('.download-option .label')[0]?.textContent).toBe(expected);
    });

    it('shows a spinner on attachments while the envelope is unsigned', async () => {
      const page = await createPage({signed: false, documents: [attachmentOne]});
      const expected = 0;

      expect(page.root.querySelectorAll('.download-option .signed').length).toBe(expected);
      expect(page.root.querySelector('.download-option .spinner-inline')).toBeTruthy();
    });

    it('shows signed status on attachments when the envelope is signed', async () => {
      const page = await createPage({signed: true, documents: [attachmentOne]});
      const expected = 'Signed';

      expect(page.root.querySelector('.download-option .signed')).toBeTruthy();
      expect(page.root.querySelector('.download-option .status-indicator span')?.textContent).toBe(expected);
    });

    it('shows an info message instead of attachment options when more than two attachments exist', async () => {
      const extraAttachment = {...attachmentOne, id: 'doc-3', name: 'Exhibit.pdf'};
      const page = await createPage({
        documents: [attachmentOne, attachmentTwo, extraAttachment],
      });
      const expected = 'Multiple documents attached. Please use the ZIP option below to download all files.';

      expect(page.root.querySelector('.info-message')?.textContent).toBe(expected);
      expect(page.root.querySelector('.download-option .label')?.textContent).not.toBe(attachmentOne.name);
    });

    it('marks the certificate option disabled until signed with a certificate available', async () => {
      const page = await createPage({signed: false, documents: [attachmentOne]});
      const expected = 'Certificate not yet available';

      const certificateOption = page.root.querySelectorAll('.content > .download-option')[1];
      expect(certificateOption?.classList.contains('disabled')).toBe(true);
      expect(certificateOption?.getAttribute('title')).toBe(expected);
      expect(certificateOption?.querySelector('.spinner-inline')).toBeTruthy();
    });

    it('shows certificate ready when signed and a certificate document exists', async () => {
      const page = await createPage({
        signed: true,
        documents: [attachmentOne, certificateDocument],
      });
      const expected = 'Ready';

      const certificateOption = page.root.querySelectorAll('.content > .download-option')[1];
      expect(certificateOption?.classList.contains('disabled')).toBe(false);
      expect(certificateOption?.querySelector('.signed')).toBeTruthy();
      expect(certificateOption?.querySelector('.status-indicator span')?.textContent).toBe(expected);
    });

    it('shows certificate ready when signed and hasCertificate is true', async () => {
      const page = await createPage({
        signed: true,
        hasCertificate: true,
        documents: [attachmentOne],
      });
      const expected = false;

      const certificateOption = page.root.querySelectorAll('.content > .download-option')[1];
      expect(certificateOption?.classList.contains('disabled')).toBe(expected);
      expect(certificateOption?.querySelector('.signed')).toBeTruthy();
    });

    it('marks the zip option disabled while polling', async () => {
      const page = await createPage({
        signed: true,
        polling: true,
        documents: [attachmentOne, certificateDocument],
      });
      const expected = 'Waiting for all documents to be ready';

      const zipOption = page.root.querySelectorAll('.content > .download-option')[2];
      expect(zipOption?.classList.contains('disabled')).toBe(true);
      expect(zipOption?.getAttribute('title')).toBe(expected);
      expect(zipOption?.querySelector('.spinner-inline')).toBeTruthy();
    });

    it('shows zip ready when signed, certificate is available, and polling is false', async () => {
      const page = await createPage({
        signed: true,
        polling: false,
        documents: [attachmentOne, certificateDocument],
      });
      const expected = 'Ready';

      const zipOption = page.root.querySelectorAll('.content > .download-option')[2];
      expect(zipOption?.classList.contains('disabled')).toBe(false);
      expect(zipOption?.querySelector('.signed')).toBeTruthy();
      expect(zipOption?.querySelector('.status-indicator span')?.textContent).toBe(expected);
    });
  });

  describe('handleOptionClick', () => {
    let downloadSpy: jest.Mock;

    beforeEach(() => {
      downloadSpy = jest.fn();
    });

    const listenForDownload = (page: Awaited<ReturnType<typeof createPage>>) => {
      page.root.addEventListener('download', downloadSpy);
    };

    it('emits download for a document attachment', async () => {
      const page = await createPage({signed: true, documents: [attachmentOne]});
      listenForDownload(page);
      const expected = {action: DownloadAction.document, documentId: attachmentOne.id};

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.document, attachmentOne.id);

      expect(downloadSpy).toHaveBeenCalledTimes(1);
      expect(downloadSpy.mock.calls[0][0].detail).toEqual(expected);
    });

    it('emits download for certificate when signed and certificate is available via document', async () => {
      const page = await createPage({
        signed: true,
        documents: [attachmentOne, certificateDocument],
      });
      listenForDownload(page);
      const expected = {action: DownloadAction.certificate, documentId: undefined};

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.certificate);

      expect(downloadSpy).toHaveBeenCalledTimes(1);
      expect(downloadSpy.mock.calls[0][0].detail).toEqual(expected);
    });

    it('emits download for certificate when signed and hasCertificate is true', async () => {
      const page = await createPage({signed: true, hasCertificate: true, documents: [attachmentOne]});
      listenForDownload(page);
      const expected = {action: DownloadAction.certificate, documentId: undefined};

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.certificate);

      expect(downloadSpy).toHaveBeenCalledTimes(1);
      expect(downloadSpy.mock.calls[0][0].detail).toEqual(expected);
    });

    it('does not emit download for certificate when the envelope is unsigned', async () => {
      const page = await createPage({
        signed: false,
        documents: [attachmentOne, certificateDocument],
      });
      listenForDownload(page);
      const expected = 0;

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.certificate);

      expect(downloadSpy).toHaveBeenCalledTimes(expected);
    });

    it('does not emit download for certificate when signed but no certificate is available', async () => {
      const page = await createPage({signed: true, documents: [attachmentOne]});
      listenForDownload(page);
      const expected = 0;

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.certificate);

      expect(downloadSpy).toHaveBeenCalledTimes(expected);
    });

    it('emits download for zip when signed, certificate is available, and not polling', async () => {
      const page = await createPage({
        signed: true,
        polling: false,
        documents: [attachmentOne, certificateDocument],
      });
      listenForDownload(page);
      const expected = {action: DownloadAction.zip, documentId: undefined};

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.zip);

      expect(downloadSpy).toHaveBeenCalledTimes(1);
      expect(downloadSpy.mock.calls[0][0].detail).toEqual(expected);
    });

    it('does not emit download for zip while polling', async () => {
      const page = await createPage({
        signed: true,
        polling: true,
        documents: [attachmentOne, certificateDocument],
      });
      listenForDownload(page);
      const expected = 0;

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.zip);

      expect(downloadSpy).toHaveBeenCalledTimes(expected);
    });

    it('does not emit download for zip when certificate is not ready', async () => {
      const page = await createPage({signed: true, documents: [attachmentOne]});
      listenForDownload(page);
      const expected = 0;

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.zip);

      expect(downloadSpy).toHaveBeenCalledTimes(expected);
    });

    it('emits download for combined when all prerequisites are met', async () => {
      const page = await createPage({
        signed: true,
        polling: false,
        documents: [attachmentOne, certificateDocument],
      });
      listenForDownload(page);
      const expected = {action: DownloadAction.combined, documentId: certificateDocument.id};

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.combined, certificateDocument.id);

      expect(downloadSpy).toHaveBeenCalledTimes(1);
      expect(downloadSpy.mock.calls[0][0].detail).toEqual(expected);
    });

    it('does not emit download for combined without a document id', async () => {
      const page = await createPage({
        signed: true,
        polling: false,
        documents: [attachmentOne, certificateDocument],
      });
      listenForDownload(page);
      const expected = 0;

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.combined);

      expect(downloadSpy).toHaveBeenCalledTimes(expected);
    });

    it('does not emit download for combined while polling', async () => {
      const page = await createPage({
        signed: true,
        polling: true,
        documents: [attachmentOne, certificateDocument],
      });
      listenForDownload(page);
      const expected = 0;

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.combined, certificateDocument.id);

      expect(downloadSpy).toHaveBeenCalledTimes(expected);
    });

    it('does not emit download for combined when certificate is not ready', async () => {
      const page = await createPage({
        signed: false,
        polling: false,
        documents: [attachmentOne, certificateDocument],
      });
      listenForDownload(page);
      const expected = 0;

      (page.rootInstance as VerdocsDownloadDialog).handleOptionClick(DownloadAction.combined, certificateDocument.id);

      expect(downloadSpy).toHaveBeenCalledTimes(expected);
    });
  });

  describe('user interactions', () => {
    it('emits download when a ready attachment option is clicked', async () => {
      const page = await createPage({signed: true, documents: [attachmentOne, certificateDocument]});
      const downloadSpy = jest.fn();
      page.root.addEventListener('download', downloadSpy);
      const expected = {action: DownloadAction.document, documentId: attachmentOne.id};

      page.root.querySelector('.download-option')?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await page.waitForChanges();

      expect(downloadSpy).toHaveBeenCalledTimes(1);
      expect(downloadSpy.mock.calls[0][0].detail).toEqual(expected);
    });

    it('does not emit download when a disabled certificate option is clicked', async () => {
      const page = await createPage({signed: false, documents: [attachmentOne]});
      const downloadSpy = jest.fn();
      page.root.addEventListener('download', downloadSpy);
      const expected = 0;

      page.root.querySelectorAll('.content > .download-option')[1]?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await page.waitForChanges();

      expect(downloadSpy).toHaveBeenCalledTimes(expected);
    });

    it('emits download when a ready certificate option is clicked', async () => {
      const page = await createPage({
        signed: true,
        documents: [attachmentOne, certificateDocument],
      });
      const downloadSpy = jest.fn();
      page.root.addEventListener('download', downloadSpy);
      const expected = {action: DownloadAction.certificate, documentId: undefined};

      page.root.querySelectorAll('.content > .download-option')[1]?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await page.waitForChanges();

      expect(downloadSpy).toHaveBeenCalledTimes(1);
      expect(downloadSpy.mock.calls[0][0].detail).toEqual(expected);
    });

    it('emits download when a ready zip option is clicked', async () => {
      const page = await createPage({
        signed: true,
        polling: false,
        documents: [attachmentOne, certificateDocument],
      });
      const downloadSpy = jest.fn();
      page.root.addEventListener('download', downloadSpy);
      const expected = {action: DownloadAction.zip, documentId: undefined};

      page.root.querySelectorAll('.content > .download-option')[2]?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await page.waitForChanges();

      expect(downloadSpy).toHaveBeenCalledTimes(1);
      expect(downloadSpy.mock.calls[0][0].detail).toEqual(expected);
    });

    it('does not emit download when a disabled zip option is clicked', async () => {
      const page = await createPage({
        signed: true,
        polling: true,
        documents: [attachmentOne, certificateDocument],
      });
      const downloadSpy = jest.fn();
      page.root.addEventListener('download', downloadSpy);
      const expected = 0;

      page.root.querySelectorAll('.content > .download-option')[2]?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await page.waitForChanges();

      expect(downloadSpy).toHaveBeenCalledTimes(expected);
    });

    it('emits exit when the dialog close button is clicked', async () => {
      const page = await createPage();
      const instance = page.rootInstance as VerdocsDownloadDialog;
      const exitEmitSpy = jest.spyOn(instance.exit, 'emit');
      const expected = 1;

      page.root.querySelector('.close-button')?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await page.waitForChanges();

      expect(exitEmitSpy).toHaveBeenCalledTimes(expected);
    });
  });
});
