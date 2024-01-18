import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {ITemplate, ITemplateDocument} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Event, EventEmitter, Prop, Host, State} from '@stencil/core';
import {createTemplateDocument, deleteTemplateDocument} from '@verdocs/js-sdk/Templates/TemplateDocuments';
import {DocIcon, FileIcon, JpgIcon, PageCountIcon, PdfIcon, PngIcon, TrashIcon} from '../../../utils/Icons';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

/**
 * Displays an edit form that allows the user to view, add, or remove a template's attachments.
 * Note that an active session and valid template ID must be supplied.
 */
@Component({
  tag: 'verdocs-template-attachments',
  styleUrl: 'verdocs-template-attachments.scss',
  shadow: false,
})
export class VerdocsTemplateAttachments {
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

  @State() uploading = false;
  @State() progressLabel = 'Uploading...';
  @State() progressPercent = 0;
  @State() showDeleteError = false;
  @State() confirmDeleteDocument: ITemplateDocument | null = null;

  @State() store: TTemplateStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[ROLES] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[ROLES] Unable to start builder session, must be authenticated');
        return;
      }

      this.store = await getTemplateStore(this.endpoint, this.templateId, false);
    } catch (e) {
      console.log('[TEMPLATE ATTACHMENTS] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.exit.emit();
  }

  handleUploadProgress(percent: number) {
    if (percent >= 99) {
      this.progressPercent = 100;
      this.progressLabel = 'Processing...';
    } else {
      this.progressPercent = percent;
    }
  }

  async handleUpload(e) {
    e.stopPropagation();

    const file = e.detail.file as File;
    if (!file) {
      return;
    }

    console.log('[ATTACHMENTS] Uploading...', file);

    this.uploading = true;
    this.progressLabel = 'Uploading...';

    try {
      const template = await createTemplateDocument(this.endpoint, this.templateId, file, this.handleUploadProgress.bind(this));
      console.log('[ATTACHMENTS] Created attachment', template);

      this.store = await getTemplateStore(this.endpoint, this.templateId, false);
      console.log('[ATTACHMENTS] Updated template', this.store.state);

      this.templateUpdated?.emit({endpoint: this.endpoint, template: this.store.state, event: 'attachments'});

      this.uploading = false;
      this.progressLabel = '';
      this.progressPercent = 0;
    } catch (e) {
      console.log('[ATTACHMENTS] Error creating template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      this.uploading = false;
    }
  }

  handleNext(e: any) {
    e.stopPropagation();
    this.uploading = false;
    this.progressLabel = '';
    this.progressPercent = 0;
    this.next?.emit({template: this.store.state as ITemplate});
  }

  async confirmDelete() {
    await deleteTemplateDocument(this.endpoint, this.templateId, this.confirmDeleteDocument.id);
    this.store = await getTemplateStore(this.endpoint, this.templateId, false);
    console.log('[ATTACHMENTS] New template', this.store.state);
    this.confirmDeleteDocument = null;
  }

  async handleDelete(document: ITemplateDocument) {
    if (this.store.state?.template_documents.length > 1) {
      this.confirmDeleteDocument = document;
    } else {
      this.showDeleteError = true;
    }
  }

  getFileIcon(document: ITemplateDocument) {
    switch (document.mime) {
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

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    const templateState = this.store?.state;
    if (!templateState.isLoaded) {
      return (
        <Host class="loading">
          <verdocs-loader />
        </Host>
      );
    }

    // This is meant to be a companion for larger visual experiences so we just go blank on errors for now.
    if (!this.endpoint.session || !templateState.profile_id) {
      return <Host class="empty" />;
    }

    return (
      <Host>
        <h5>Existing Attachments</h5>

        <div class="attachments">
          {this.store?.state.template_documents.map(document => (
            <div class="attachment">
              <div class="file-icon" innerHTML={this.getFileIcon(document)} />
              <div class="filename" title={document.name}>
                {document.name}
              </div>
              <div class="pages">
                <div class="count">{document.page_numbers}</div>
                <div class="pages-icon" innerHTML={PageCountIcon} />
              </div>
              <div class="trash-icon" innerHTML={TrashIcon} onClick={() => this.handleDelete(document)} />
            </div>
          ))}
        </div>

        <h5>Attach a New Document</h5>

        {this.uploading ? (
          <div class="loader-wrapper">
            <verdocs-loader />

            {this.progressLabel && (
              <div class="progress-wrapper">
                <verdocs-progress-bar showPercent={true} percent={this.progressPercent} label={this.progressLabel} />
              </div>
            )}
          </div>
        ) : (
          <verdocs-file-chooser onFileSelected={e => this.handleUpload(e)} />
        )}

        <div class="buttons">
          <verdocs-button variant="outline" label="Cancel" size="small" onClick={e => this.handleCancel(e)} disabled={this.uploading} />
          <verdocs-button label="Next" size="small" onClick={e => this.handleNext(e)} disabled={!this.store?.state.template_documents.length || this.uploading} />
        </div>

        {this.showDeleteError && (
          <verdocs-ok-dialog heading="Unable to Delete Attachment" message="Templates must contain at least one attachment." onNext={() => (this.showDeleteError = false)} />
        )}

          {this.confirmDeleteDocument && (
          <verdocs-ok-dialog
            heading="Delete this Attachment?"
            message="This operation cannot be undone. All fields placed<br />on the deleted attachment will also be removed."
            onNext={() => this.confirmDelete()}
            showCancel={true}
            onExit={() => {
              this.confirmDeleteDocument = null;
            }}
          />
        )}
      </Host>
    );
  }
}
