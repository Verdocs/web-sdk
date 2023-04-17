import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, Host, State} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';
import {createTemplate} from '@verdocs/js-sdk/Templates/Templates';

const FileIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>';

const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#eeeeee"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;

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
   * Event fired when the user changes the type.
   */
  @Event({composed: true}) next: EventEmitter<{template: ITemplate}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() uploading = false;
  @State() progressLabel = 'Uploading...';
  @State() progressPercent = 0;

  store: TTemplateStore | null = null;

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

      this.endpoint.loadSession();
    } catch (e) {
      console.log('[TEMPLATE ATTACHMENTS] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.exit.emit();
  }

  async handleUpload(e) {
    e.stopPropagation();

    const file = e.detail.file;
    if (!file) {
      return;
    }

    console.log('[ATTACHMENTS] Uploading...', file);

    this.uploading = true;
    this.progressLabel = 'Uploading...';

    try {
      const template = await createTemplate(this.endpoint, {name: file.name, documents: [file]}, percent => {
        if (percent >= 99) {
          this.progressLabel = 'Processing...';
          this.progressPercent = 100;
        } else {
          this.progressPercent = percent;
        }
      });
      console.log('[CREATE] Created template', template);
      this.next?.emit({template: this.store.state as ITemplate});

      this.uploading = false;
      this.progressLabel = '';
      this.progressPercent = 0;
    } catch (e) {
      console.log('[CREATE] Error creating template', e);
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
              <div class="file-icon" innerHTML={FileIcon} />
              <div class="filename">
                {document.name} ({document.page_numbers} page{document.page_numbers > 1 ? 's' : ''})
              </div>
              <div class="trash-icon" innerHTML={TrashIcon} />
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
      </Host>
    );
  }
}
