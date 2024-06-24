import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import {unicodeNBSP} from '../../../utils/Icons';

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
    e.stopPropagation();
    this.file = null;
    this.fileSelected?.emit({file: null});
    document.getElementById('verdocs-file-chooser')?.click();
  }

  render() {
    const buttonlabel = this.file ? 'Select a different file' : 'Select a file from your computer';

    return (
      <Host>
        <input
          type="file"
          multiple
          id="verdocs-file-chooser"
          accept="application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{display: 'none'}}
          onChange={e => this.handleFileChanged(e)}
        />

        <div class="upload-box">
          {/*<div innerHTML={FileIcon} />*/}

          <div class="selected-filename">{this.file ? this.file.name : 'Drag a file here'}</div>

          <div class="or-prefer">{this.file ? unicodeNBSP : 'Or, if you prefer...'}</div>

          <verdocs-button label={buttonlabel} size="small" onClick={e => this.handleSelectFile(e)} />
        </div>
      </Host>
    );
  }
}
