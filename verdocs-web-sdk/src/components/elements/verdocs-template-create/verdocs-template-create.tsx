import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State} from '@stencil/core';

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
  @Event({composed: true}) fileUploaded: EventEmitter<{filePath: string}>;

  @State() filePath: string;

  componentWillLoad() {}

  handleFileChanged(e: any) {
    console.log(e);
  }

  handleCancel(e) {
    e.stopPropagation();
    this.cancel?.emit();
  }

  handleSubmit(e) {
    e.stopPropagation();
    this.fileUploaded?.emit({filePath: this.filePath});
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
        <div class="upload-box">
          <div>
            <span innerHTML={FileIcon} />
          </div>
          <div style={{marginTop: '20px', fontSize: '20px', fontWeight: 'bold'}}>Drag a file here</div>
          <div style={{marginTop: '20px', marginBottom: '20px', fontSize: '16px'}}>Or, if you prefer...</div>
          <verdocs-button label="Select a file from your computer" size="small" onPress={e => this.handleCancel(e)} />
        </div>

        <div class="buttons">
          <verdocs-button variant="outline" label="Cancel" size="small" onPress={e => this.handleCancel(e)} />
          <verdocs-button label="Next" size="small" onPress={e => this.handleSubmit(e)} disabled={true} />
        </div>
      </form>
    );
  }
}
