import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State} from '@stencil/core';
import {createTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {SDKError} from '../../../utils/errors';
import {ITemplate, ITemplateDocument} from '@verdocs/js-sdk/Templates/Types';
import {createTemplateDocument} from '@verdocs/js-sdk/Templates/TemplateDocuments';
import {createPage} from '@verdocs/js-sdk/Templates/Pages';

const FileIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>';

/**
 * Displays a file upload mechanism suitable for the first step of creating a template.
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
   * Event fired when the user cancels the dialog.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired when the user changes the type.
   */
  @Event({composed: true}) templateCreated: EventEmitter<{template: ITemplate; template_document: ITemplateDocument}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() file: File | null;

  componentWillLoad() {}

  handleFileChanged(e: any) {
    console.log('files', e.target.files);
    this.file = e.target.files?.[0] || null;
    console.log('Selected file', this.file);
    // this.filePath = e.target.files?.[0]?.name;
  }

  handleUpload(e) {
    e.stopPropagation();
    const fileElem = document.getElementById('verdocs-template-create-file');
    fileElem.click();
  }

  handleCancel(e) {
    e.stopPropagation();
    this.cancel?.emit();
  }

  async handleSubmit(e) {
    e.stopPropagation();

    // Should be true if we're here because onClick is only enabled then. We're just guarding this for Typescript.
    if (!this.file) {
      return;
    }

    try {
      const template = await createTemplate(this.endpoint, {name: this.file.name});
      console.log('created template', template);

      const template_document = await createTemplateDocument(this.endpoint, template.id, this.file);
      console.log('created document', template_document);

      for await (let pageNumber of Array.from(Array(template_document.page_numbers).keys(), n => n + 1)) {
        console.log('Updating page', pageNumber);
        const page = await createPage(this.endpoint, template.id, {sequence: pageNumber, page_number: pageNumber, document_id: template_document.id});
        console.log('Created page', page);
      }

      this.templateCreated?.emit({template, template_document});
      // this.fileUploaded?.emit({filePath: this.filePath});
    } catch (e) {
      console.log('[TEMPLATE-CREATE] Error creating template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
        <input type="file" id="verdocs-template-create-file" multiple accept="application/pdf" style={{display: 'none'}} onChange={e => this.handleFileChanged(e)} />

        <div class="upload-box">
          <div>
            <span innerHTML={FileIcon} />
          </div>
          <div style={{marginTop: '20px', fontSize: '20px', fontWeight: 'bold'}}>Drag a file here</div>
          <div style={{marginTop: '20px', marginBottom: '20px', fontSize: '16px'}}>Or, if you prefer...</div>
          <verdocs-button label="Select a file from your computer" size="small" onClick={e => this.handleUpload(e)} />
        </div>

        <div class="buttons">
          <verdocs-button variant="outline" label="Cancel" size="small" onClick={e => this.handleCancel(e)} />
          <verdocs-button label="Next" size="small" onClick={e => this.handleSubmit(e)} disabled={!this.file} />
        </div>
      </form>
    );
  }
}
