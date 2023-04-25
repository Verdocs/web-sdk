import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';
import {createTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import {SDKError} from '../../../utils/errors';

const unicodeNBSP = ' ';

const FileIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>';

/**
 * Displays a file upload mechanism suitable for the first step of creating a template.
 * This is typically the first step in a template creation workflow.
 */
@Component({
  tag: 'verdocs-template-create',
  styleUrl: 'verdocs-template-create.scss',
  shadow: false,
})
export class VerdocsTemplateCreate {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired when the user changes the type.
   */
  @Event({composed: true}) next: EventEmitter<ITemplate>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() file: File | null;
  @State() creating = false;
  @State() progressLabel = 'Uploading...';
  @State() progressPercent = 0;

  componentWillLoad() {
    this.endpoint.setTimeout(30000);
    this.endpoint.loadSession();
  }

  handleFileChanged(e: any) {
    this.file = e.target.files?.[0] || null;
    console.log('[CREATE] Selected file', this.file);
    // this.filePath = e.target.files?.[0]?.name;
  }

  handleUpload(e) {
    e.stopPropagation();
    const fileElem = document.getElementById('verdocs-template-create-file');
    fileElem.click();
  }

  handleCancel(e) {
    e.stopPropagation();
    this.exit.emit();
  }

  async handleSubmit(e) {
    e.stopPropagation();

    console.log('Submitting');

    // Should be true if we're here because onClick is only enabled then. We're just guarding this for Typescript.
    if (!this.file) {
      return;
    }

    this.creating = true;
    this.progressLabel = 'Uploading...';

    try {
      const template = await createTemplate(this.endpoint, {name: this.file.name, documents: [this.file]}, percent => {
        if (percent >= 99) {
          this.progressLabel = 'Processing...';
          this.progressPercent = 100;
        } else {
          this.progressPercent = percent;
        }
      });
      console.log('[CREATE] Created template', template);
      this.next?.emit(template);

      this.creating = false;
      this.progressLabel = '';
      this.progressPercent = 0;
    } catch (e) {
      console.log('[CREATE] Error creating template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      this.creating = false;
    }
  }

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    return (
      <Host>
        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <input type="file" id="verdocs-template-create-file" multiple accept="application/pdf" style={{display: 'none'}} onChange={e => this.handleFileChanged(e)} />

          {this.creating ? (
            <div class="loader-wrapper">
              <verdocs-loader />
              {this.progressLabel && (
                <div class="progress-wrapper">
                  <verdocs-progress-bar showPercent={true} percent={this.progressPercent} label={this.progressLabel} />
                </div>
              )}
            </div>
          ) : (
            <div
              class="upload-box"
              onDrop={(e: any) => {
                e.preventDefault();
                e.target.classList.remove('drag-over');
                this.file = e.dataTransfer.files[0];
              }}
              onDragOver={(e: any) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }}
              onDragEnter={(e: any) => e.target.classList.add('drag-over')}
              onDragLeave={(e: any) => e.target.classList.remove('drag-over')}
            >
              <div>
                <span innerHTML={FileIcon} />
              </div>
              <div style={{marginTop: '20px', fontSize: '20px', fontWeight: 'bold', overflowWrap: 'anywhere'}}>{this.file ? this.file.name : 'Drag a file here'}</div>
              <div
                style={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  fontSize: '16px',
                  height: '20px',
                }}
              >
                {this.file ? unicodeNBSP : 'Or, if you prefer...'}
              </div>
              <verdocs-button label={this.file ? 'Select a different file' : 'Select a file from your computer'} size="small" onClick={e => this.handleUpload(e)} />
            </div>
          )}

          <div class="buttons">
            <verdocs-button variant="outline" label="Cancel" size="small" onClick={e => this.handleCancel(e)} disabled={this.creating} />
            <verdocs-button label="Next" size="small" onClick={e => this.handleSubmit(e)} disabled={!this.file || this.creating} />
          </div>
        </form>
      </Host>
    );
  }
}
