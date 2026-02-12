import {Component, h, Event, EventEmitter, Prop} from '@stencil/core';

const DocumentIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 2V9H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CertificateIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ZipIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 16V22H14V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 16H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 22H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12L12 16L16 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16V4H20V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ChevronRight = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CheckIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CircleIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg>`;
const RefreshIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 4V10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.49 15A9 9 0 1 1 21.23 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

@Component({
  tag: 'verdocs-download-dialog',
  styleUrl: 'verdocs-download-dialog.scss',
  shadow: false,
})
export class VerdocsDownloadDialog {
  /**
   * Event fired when an option is selected.
   */
  /**
   * Event fired when an option is selected.
   */
  @Event({composed: true}) next: EventEmitter<{action: 'document' | 'certificate' | 'zip'; documentId?: string}>;

  /**
   * Event fired when Cancel is pressed or background is clicked.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * If true, the envelope is considered signed.
   */
  @Prop() signed = false;

  /**
   * If true, we are currently polling the server for updates.
   */
  @Prop() polling = false;

  /**
   * The list of documents in the envelope.
   */
  @Prop() documents: any[] = [];

  /**
   * If true, the envelope has a certificate available for download.
   */
  @Prop() hasCertificate = false;

  handleOptionClick(action: 'document' | 'certificate' | 'zip', documentId?: string) {
    const hasCert = this.documents.some(d => d.type === 'certificate') || this.hasCertificate;
    const canDownloadCert = this.signed && hasCert;

    if ((action === 'certificate' || action === 'zip') && !canDownloadCert) {
      return;
    }
    this.next.emit({action, documentId} as any);
  }

  render() {
    const attachments = this.documents.filter(d => d.type === 'attachment');
    const hasCertificateDoc = this.documents.some(d => d.type === 'certificate') || this.hasCertificate;
    const canDownloadFinals = this.signed && hasCertificateDoc;

    return (
      <verdocs-dialog onExit={() => this.exit.emit()}>
        <div slot="heading" class="heading-container">
          <h3 style={{margin: '0', fontSize: '1.25rem', fontWeight: '600', padding: '16px 24px'}}>Download</h3>
          {this.polling && (
            <div class="polling-indicator" title="Checking for updates...">
              <div class="spinner" innerHTML={RefreshIcon} />
            </div>
          )}
        </div>

        <div slot="content" class="content">
          {attachments.length <= 2 &&
            attachments.map(doc => (
              <div class="download-option" onClick={() => this.handleOptionClick('document', doc.id)}>
                <div class="icon-container" innerHTML={DocumentIcon}></div>
                <div class="text-container">
                  <div class="label">{doc.name}</div>
                  <div class="description">{this.signed ? 'Download the document' : 'Download the document'}</div>
                </div>
                <div class="status-indicator">
                  {this.signed ? <div class="signed" innerHTML={CheckIcon}></div> : <div class="unsigned" innerHTML={CircleIcon}></div>}
                  <span>{this.signed ? 'Signed' : 'In Progress'}</span>
                </div>
                <div class="arrow" innerHTML={ChevronRight}></div>
              </div>
            ))}

          {attachments.length > 2 && <div class="info-message">Multiple documents attached. Please use the ZIP option below to download all files.</div>}

          <div
            class={{'download-option': true, 'disabled': !canDownloadFinals}}
            onClick={() => this.handleOptionClick('certificate')}
            title={!canDownloadFinals ? 'Certificate not yet available' : ''}
          >
            <div class="icon-container" innerHTML={CertificateIcon}></div>
            <div class="text-container">
              <div class="label">Certificate</div>
              <div class="description">Download the certificate</div>
            </div>
            <div class="arrow" innerHTML={ChevronRight}></div>
          </div>

          <div
            class={{'download-option': true, 'disabled': !canDownloadFinals}}
            onClick={() => this.handleOptionClick('zip')}
            title={!canDownloadFinals ? 'Certificate not yet available' : ''}
          >
            <div class="icon-container" innerHTML={ZipIcon}></div>
            <div class="text-container">
              <div class="label">All Files</div>
              <div class="description">Download everything as a ZIP file</div>
            </div>
            <div class="arrow" innerHTML={ChevronRight}></div>
          </div>
        </div>

        <div slot="footer" style={{display: 'none'}} />
      </verdocs-dialog>
    );
  }
}
