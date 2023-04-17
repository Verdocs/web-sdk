import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';

const unicodeNBSP = ' ';

const FileIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>';

/**
 * Displays a file picker to upload an attachment. This component is just the picker - the host application or component should
 * provide the actual upload functionality.
 */
@Component({
  tag: 'verdocs-file-chooser',
  styleUrl: 'verdocs-file-chooser.scss',
  shadow: false,
})
export class VerdocsFileChooser {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * Event fired when a file has been selected. Note that the file may be null if the user is choosing a different file.
   * Host applications should use this event to enable/disable buttons to upload or otherwise process the selected file.
   */
  @Event({composed: true}) fileSelected: EventEmitter<{file: File | null}>;

  @State() file: File | null;

  handleFileChanged(e: any) {
    this.file = e.target.files?.[0] || null;
    this.fileSelected?.emit({file: this.file});
    console.debug('[CHOOSER] Selected file', this.file);
  }

  handleSelectFile(e: any) {
    console.log('sf');
    e.stopPropagation();
    this.file = null;
    this.fileSelected?.emit({file: null});
    document.getElementById('verdocs-file-chooser')?.click();
  }

  render() {
    return (
      <Host>
        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <input
            type="file"
            multiple
            id="verdocs-file-chooser"
            accept="application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{display: 'none'}}
            onChange={e => this.handleFileChanged(e)}
          />

          <div class="upload-box">
            <div>
              <span innerHTML={FileIcon} />
            </div>

            <div style={{marginTop: '20px', fontSize: '20px', fontWeight: 'bold', overflowWrap: 'anywhere'}}>{this.file ? this.file.name : 'Drag a file here'}</div>
            <div style={{marginTop: '20px', marginBottom: '20px', fontSize: '16px', height: '20px'}}>{this.file ? unicodeNBSP : 'Or, if you prefer...'}</div>
            <verdocs-button label={this.file ? 'Select a different file' : 'Select a file from your computer'} size="small" onClick={e => this.handleSelectFile(e)} />
          </div>
        </form>
      </Host>
    );
  }
}
