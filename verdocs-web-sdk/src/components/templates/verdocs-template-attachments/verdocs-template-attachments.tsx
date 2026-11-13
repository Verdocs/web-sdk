import {Component, h, Event, EventEmitter, Prop, Host, State} from '@stencil/core';
import {createTemplateDocument, deleteTemplateDocument, downloadTemplateDocument, getTemplate} from '@verdocs/js-sdk';
import {getTemplateDocumentPageDisplayUri, ITemplate, ITemplateDocument, updateTemplateDocument, VerdocsEndpoint} from '@verdocs/js-sdk';
import {DocIcon, DotsIcon, FileIcon, JpgIcon, PdfIcon, PngIcon, UploadIcon} from '../../../utils/Icons';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

interface IUpload {
  key: string;
  name: string;
  percent: number;
}

const DOCUMENT_DRAG_TYPE = 'application/x-verdocs-document';
const ACCEPTED_FILES = /\.(pdf|docx?)$/i;
const ACCEPT = 'application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

/**
 * Displays an edit form that allows the user to view, add, reorder, rename, download, or remove a template's documents.
 * Files may be dropped anywhere on the component. Note that an active session and valid template ID must be supplied.
 */
@Component({
  tag: 'verdocs-template-attachments',
  styleUrl: 'verdocs-template-attachments.scss',
  shadow: false,
})
export class VerdocsTemplateAttachments {
  private templateListenerId = null;
  private fileInput?: HTMLInputElement;
  private queue: {key: string; file: File}[] = [];
  private processingQueue = false;
  private fileDragDepth = 0;
  private focusRename = false;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The template ID to edit.
   */
  @Prop() templateId: string = '';

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired when the user clicks the next button.
   */
  @Event({composed: true}) next: EventEmitter<{template: ITemplate}>;

  /**
   * Event fired when the user updates the template.
   */
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() loading = true;
  @State() template: ITemplate | null = null;
  @State() uploads: IUpload[] = [];
  @State() fileDragActive = false;
  @State() dragId: string | null = null;
  @State() dropTarget: {id: string; after: boolean} | null = null;
  @State() menuFor: string | null = null;
  @State() renaming: string | null = null;
  @State() thumbnails: Record<string, string> = {};
  @State() showDeleteError = false;
  @State() confirmDeleteDocument: ITemplateDocument | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[ATTACHMENTS] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[ATTACHMENTS] Unable to start builder session, must be authenticated');
        return;
      }

      this.listenToTemplate();
    } catch (e) {
      console.log('[ATTACHMENTS] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  // Stencil doesn't rerun componentWillLoad when an element is reattached, so we listen again here.
  connectedCallback() {
    if (this.template && !this.templateListenerId) {
      this.listenToTemplate();
    }
  }

  disconnectedCallback() {
    this.unlistenToTemplate();
  }

  async listenToTemplate() {
    this.unlistenToTemplate();
    this.templateListenerId = Store.subscribe(
      'templates',
      this.templateId,
      () => getTemplate(this.endpoint, this.templateId),
      false,
      (template: ITemplate) => {
        this.template = template;
        this.loading = false;
        this.loadThumbnails();
      },
    );
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  loadThumbnails() {
    for (const doc of this.template?.documents || []) {
      if (this.thumbnails[doc.id] === undefined) {
        this.thumbnails = {...this.thumbnails, [doc.id]: ''};
        getTemplateDocumentPageDisplayUri(this.endpoint, doc.id, 1)
          .then(uri => (this.thumbnails = {...this.thumbnails, [doc.id]: uri}))
          .catch(e => console.log('[ATTACHMENTS] Unable to load thumbnail', doc.id, e));
      }
    }
  }

  sortedDocuments() {
    return [...(this.template?.documents || [])].sort((a, b) => a.order - b.order || String(a.created_at).localeCompare(String(b.created_at)));
  }

  applyTemplate(template: ITemplate) {
    Store.updateTemplate(this.templateId, template);
    this.template = template;
    this.loadThumbnails();
    this.templateUpdated?.emit({endpoint: this.endpoint, template, event: 'attachments'});
  }

  async reloadTemplate() {
    const template = await Store.getTemplate(this.endpoint, this.templateId, true);
    if (template) {
      this.applyTemplate(template);
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.exit.emit();
  }

  handleNext(e: any) {
    e.stopPropagation();
    this.next?.emit({template: this.template});
  }

  queueFiles(files: File[]) {
    for (const file of files) {
      if (!ACCEPTED_FILES.test(file.name)) {
        VerdocsToast(`${file.name} isn't a PDF or Word file, so it wasn't added.`, {style: 'error'});
        continue;
      }

      const key = `${Date.now()}-${Math.random()}`;
      this.queue.push({key, file});
      this.uploads = [...this.uploads, {key, name: file.name, percent: 0}];
    }

    this.processQueue();
  }

  // Uploads run one at a time so documents keep the order they were added in
  async processQueue() {
    if (this.processingQueue) {
      return;
    }

    this.processingQueue = true;
    while (this.queue.length) {
      const {key, file} = this.queue.shift();
      try {
        await createTemplateDocument(this.endpoint, this.templateId, file, percent => {
          this.uploads = this.uploads.map(upload => (upload.key === key ? {...upload, percent} : upload));
        });
        await this.reloadTemplate();
      } catch (e) {
        console.log('[ATTACHMENTS] Error uploading document', e);
        VerdocsToast(`Unable to add ${file.name}: ${e.response?.data?.error || e.message}`, {style: 'error'});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      }

      this.uploads = this.uploads.filter(upload => upload.key !== key);
    }

    this.processingQueue = false;
  }

  handleFileDragEnter(e: DragEvent) {
    if (!e.dataTransfer?.types.includes('Files')) {
      return;
    }

    e.preventDefault();
    this.fileDragDepth++;
    this.fileDragActive = true;
  }

  handleFileDragOver(e: DragEvent) {
    if (e.dataTransfer?.types.includes('Files')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  }

  handleFileDragLeave(e: DragEvent) {
    if (!e.dataTransfer?.types.includes('Files')) {
      return;
    }

    this.fileDragDepth = Math.max(0, this.fileDragDepth - 1);
    if (!this.fileDragDepth) {
      this.fileDragActive = false;
    }
  }

  handleFileDrop(e: DragEvent) {
    if (!e.dataTransfer?.files?.length) {
      return;
    }

    e.preventDefault();
    this.fileDragDepth = 0;
    this.fileDragActive = false;
    this.queueFiles(Array.from(e.dataTransfer.files));
  }

  handleRowDragOver(e: DragEvent, doc: ITemplateDocument) {
    if (!this.dragId) {
      return;
    }

    e.preventDefault();
    const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const after = e.clientY > box.top + box.height / 2;
    if (this.dropTarget?.id !== doc.id || this.dropTarget?.after !== after) {
      this.dropTarget = {id: doc.id, after};
    }
  }

  handleRowDrop(e: DragEvent, doc: ITemplateDocument) {
    if (!this.dragId) {
      return;
    }

    e.preventDefault();
    const dragged = this.dragId;
    const after = this.dropTarget?.id === doc.id && this.dropTarget.after;
    this.dragId = null;
    this.dropTarget = null;
    if (dragged === doc.id) {
      return;
    }

    const others = this.sortedDocuments().filter(d => d.id !== dragged);
    this.moveDocument(dragged, others.findIndex(d => d.id === doc.id) + (after ? 1 : 0));
  }

  async moveDocument(documentId: string, index: number) {
    const documents = this.sortedDocuments();
    const current = documents.findIndex(d => d.id === documentId);
    if (current < 0 || current === index) {
      return;
    }

    const reordered = documents.filter(d => d.id !== documentId);
    reordered.splice(index, 0, documents[current]);
    this.template = {...this.template, documents: reordered.map((d, i) => ({...d, order: i + 1}))};
    await this.saveDocument(documentId, {order: index + 1});
  }

  async finishRename(doc: ITemplateDocument, value: string) {
    this.renaming = null;
    const name = value.trim();
    if (!name || name === doc.name) {
      return;
    }

    this.template = {...this.template, documents: this.template.documents.map(d => (d.id === doc.id ? {...d, name} : d))};
    await this.saveDocument(doc.id, {name});
  }

  async saveDocument(documentId: string, params: {name?: string; order?: number}) {
    try {
      this.applyTemplate(await updateTemplateDocument(this.endpoint, documentId, params));
    } catch (e) {
      console.log('[ATTACHMENTS] Error updating document', e);
      VerdocsToast(`Unable to update the document: ${e.response?.data?.error || e.message}`, {style: 'error'});
      await this.reloadTemplate();
    }
  }

  async downloadDocument(doc: ITemplateDocument) {
    try {
      const url = URL.createObjectURL(await downloadTemplateDocument(this.endpoint, doc.id));
      Object.assign(document.createElement('a'), {href: url, download: doc.name}).click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.log('[ATTACHMENTS] Error downloading document', e);
      VerdocsToast(`Unable to download ${doc.name}.`, {style: 'error'});
    }
  }

  handleDelete(doc: ITemplateDocument) {
    if ((this.template?.documents || []).length > 1) {
      this.confirmDeleteDocument = doc;
    } else {
      this.showDeleteError = true;
    }
  }

  async confirmDelete() {
    const doc = this.confirmDeleteDocument;
    this.confirmDeleteDocument = null;
    try {
      this.applyTemplate(await deleteTemplateDocument(this.endpoint, doc.id));
    } catch (e) {
      console.log('[ATTACHMENTS] Error deleting document', e);
      VerdocsToast(`Unable to delete ${doc.name}: ${e.response?.data?.error || e.message}`, {style: 'error'});
      await this.reloadTemplate();
    }
  }

  handleMenu(doc: ITemplateDocument, action: string, index: number) {
    this.menuFor = null;
    if (action === 'rename') {
      this.focusRename = true;
      this.renaming = doc.id;
    } else if (action === 'up' || action === 'down') {
      this.moveDocument(doc.id, index + (action === 'up' ? -1 : 1));
    } else if (action === 'download') {
      this.downloadDocument(doc);
    } else if (action === 'delete') {
      this.handleDelete(doc);
    }
  }

  getFileIcon(doc: ITemplateDocument) {
    switch (doc.mime) {
      case 'application/pdf':
        return PdfIcon;
      case 'image/jpeg':
        return JpgIcon;
      case 'image/png':
        return PngIcon;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return DocIcon;
    }

    return FileIcon;
  }

  renderDocument(doc: ITemplateDocument, index: number, count: number) {
    const fields = (this.template?.fields || []).filter(field => field.document_id === doc.id).length;
    const size = doc.size >= 1048576 ? `${(doc.size / 1048576).toFixed(1)} MB` : doc.size ? `${Math.max(1, Math.round(doc.size / 1024))} KB` : '';
    const meta = [plural(doc.pages, 'page'), size, fields ? plural(fields, 'field') : 'No fields yet'].filter(Boolean).join(' · ');
    const menuId = `verdocs-attachment-menu-${doc.id}`;
    const classes = {
      'attachment': true,
      'dragging': this.dragId === doc.id,
      'drop-before': this.dropTarget?.id === doc.id && !this.dropTarget.after,
      'drop-after': this.dropTarget?.id === doc.id && this.dropTarget.after,
    };

    return (
      <div
        class={classes}
        key={doc.id}
        draggable={this.renaming !== doc.id}
        onDragStart={e => {
          this.dragId = doc.id;
          e.dataTransfer.setData(DOCUMENT_DRAG_TYPE, doc.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onDragEnd={() => {
          this.dragId = null;
          this.dropTarget = null;
        }}
        onDragOver={e => this.handleRowDragOver(e, doc)}
        onDrop={e => this.handleRowDrop(e, doc)}
      >
        <span class="grip" title="Drag to reorder" />
        {this.thumbnails[doc.id] ? (
          <img class="thumbnail" src={this.thumbnails[doc.id]} alt="" draggable={false} onError={() => (this.thumbnails = {...this.thumbnails, [doc.id]: ''})} />
        ) : (
          <span class="thumbnail file-icon" innerHTML={this.getFileIcon(doc)} />
        )}
        <div class="details">
          {this.renaming === doc.id ? (
            <input
              class="rename"
              aria-label="Document name"
              value={doc.name}
              ref={el => {
                if (el && this.focusRename) {
                  this.focusRename = false;
                  el.focus();
                  el.select();
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                } else if (e.key === 'Escape') {
                  this.renaming = null;
                }
              }}
              onBlur={e => this.renaming === doc.id && this.finishRename(doc, (e.target as HTMLInputElement).value)}
            />
          ) : (
            <div class="filename" title={doc.name}>
              {doc.name}
            </div>
          )}
          <div class="meta">{meta}</div>
        </div>
        <button
          class="menu-button"
          id={menuId}
          type="button"
          aria-label={`Options for ${doc.name}`}
          innerHTML={DotsIcon}
          onClick={() => (this.menuFor = this.menuFor === doc.id ? null : doc.id)}
        />
        {this.menuFor === doc.id && (
          <verdocs-portal anchor={menuId} onClickAway={() => (this.menuFor = null)}>
            <div class="verdocs-attachment-menu" role="menu">
              {[
                {action: 'rename', label: 'Rename'},
                {action: 'up', label: 'Move up', disabled: index === 0},
                {action: 'down', label: 'Move down', disabled: index === count - 1},
                {action: 'download', label: 'Download'},
                {action: 'delete', label: 'Delete', danger: true},
              ].map(item => (
                <button
                  type="button"
                  role="menuitem"
                  class={{'verdocs-attachment-menu-item': true, 'danger': !!item.danger}}
                  disabled={!!item.disabled}
                  onClick={() => this.handleMenu(doc, item.action, index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </verdocs-portal>
        )}
      </div>
    );
  }

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    if (this.loading) {
      return (
        <Host class="loading">
          <verdocs-loader />
        </Host>
      );
    }

    // This is meant to be a companion for larger visual experiences so we just go blank on errors for now.
    if (!this.endpoint.session || !this.template) {
      return <Host class="empty" />;
    }

    const documents = this.sortedDocuments();
    const deletingFields = this.confirmDeleteDocument ? (this.template.fields || []).filter(field => field.document_id === this.confirmDeleteDocument.id).length : 0;

    return (
      <Host
        class={{'file-drag-active': this.fileDragActive}}
        onDragEnter={e => this.handleFileDragEnter(e)}
        onDragOver={e => this.handleFileDragOver(e)}
        onDragLeave={e => this.handleFileDragLeave(e)}
        onDrop={e => this.handleFileDrop(e)}
      >
        <div class="header">
          <div class="titles">
            <h5>Documents</h5>
            <div class="subtitle">Signers see them in this order.</div>
          </div>
          <verdocs-button variant="secondary" size="small" label="Add documents" startIcon={UploadIcon} onClick={() => this.fileInput?.click()} />
          <input
            type="file"
            multiple
            accept={ACCEPT}
            class="file-input"
            ref={el => (this.fileInput = el)}
            onChange={e => {
              const input = e.target as HTMLInputElement;
              this.queueFiles(Array.from(input.files || []));
              input.value = '';
            }}
          />
        </div>

        <div class="attachments">
          {documents.map((doc, index) => this.renderDocument(doc, index, documents.length))}
          {this.uploads.map(upload => (
            <div class="attachment uploading" key={upload.key}>
              <span class="grip" />
              <span class="thumbnail file-icon" innerHTML={FileIcon} />
              <div class="details">
                <div class="filename" title={upload.name}>
                  {upload.name}
                </div>
                <div class="progress">
                  <div class="progress-fill" style={{width: `${upload.percent}%`}} />
                </div>
              </div>
              <span class="status">{upload.percent >= 99 ? 'Processing' : 'Uploading'}</span>
            </div>
          ))}
        </div>

        <div class={{dropzone: true, active: this.fileDragActive}} onClick={() => this.fileInput?.click()}>
          <span class="dropzone-icon" innerHTML={UploadIcon} />
          <b>{this.fileDragActive ? 'Drop to add documents' : 'Drop PDF or Word files here'}</b>
          <span>{this.fileDragActive ? 'PDF or Word files' : 'or click to choose files'}</span>
        </div>

        <div class="buttons">
          <verdocs-button variant="outline" label="Cancel" size="small" onClick={e => this.handleCancel(e)} />
          <verdocs-button label="Next" size="small" onClick={e => this.handleNext(e)} disabled={!documents.length || this.uploads.length > 0} />
        </div>

        {this.showDeleteError && (
          <verdocs-ok-dialog heading="Unable to delete document" message="A template needs at least one document." onNext={() => (this.showDeleteError = false)} />
        )}

        {this.confirmDeleteDocument && (
          <verdocs-ok-dialog
            heading="Delete this document?"
            message={deletingFields ? `The ${plural(deletingFields, 'field')} placed on it will be removed too. This can't be undone.` : "This can't be undone."}
            showCancel={true}
            onNext={() => this.confirmDelete()}
            onExit={() => (this.confirmDeleteDocument = null)}
          />
        )}
      </Host>
    );
  }
}
