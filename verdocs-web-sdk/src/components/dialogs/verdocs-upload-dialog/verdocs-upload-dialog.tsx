import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';
import {fileToDataUrl, FileWithData} from '@verdocs/js-sdk/Utils/Files';
import Paperclip from './paperclip.svg';
import Trash from './trash.svg';

/**
 * Display a file upload experience.
 */
@Component({
  tag: 'verdocs-upload-dialog',
  styleUrl: 'verdocs-upload-dialog.scss',
})
export class VerdocsUploadDialog {
  private fileInput?: HTMLInputElement;

  /**
   * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
   */
  @Prop() open: boolean = false;

  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason.
   */
  @Event({composed: true}) done: EventEmitter<FileWithData[]>;

  @State() draggingOver = false;

  @State() decodedFiles = [] as FileWithData[];

  handleCancel() {
    this.cancel.emit();
    this.open = false;
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.className === 'background-overlay') {
      e.preventDefault();
      this.handleCancel();
    }
  }

  handleDone() {
    this.done.emit(this.decodedFiles);
    this.open = false;
  }

  handleDragOver(e) {
    e.preventDefault();
    this.draggingOver = true;
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.draggingOver = false;
  }

  async handleDrop(e) {
    e.preventDefault();
    this.draggingOver = false;

    // Required for cross-browser support. Note that dataTransfer.items is of type DataTransferItemList and is not an array.
    let droppedFiles = [] as File[];
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          const file = e.dataTransfer.items[i].getAsFile();
          droppedFiles.push(file);
        }
      }
    } else {
      droppedFiles = e.dataTransfer.files;
    }

    this.decodedFiles = await Promise.all(droppedFiles.map(fileToDataUrl));
  }

  handleRemoveAttachment(index: number) {
    const newFiles = [...this.decodedFiles];
    newFiles.splice(index, 1);
    this.decodedFiles = newFiles;
  }

  handleSelectFile() {
    this.fileInput?.click();
  }

  async handleFileChange(e) {
    console.log('fileChange', e);
    console.log('files', this.fileInput?.files);
    let droppedFiles = [] as File[];
    for (let i = 0; i < this.fileInput?.files.length; i++) {
      droppedFiles.push(this.fileInput?.files[i]);
    }
    this.decodedFiles = await Promise.all(droppedFiles.map(fileToDataUrl));
  }

  render() {
    return (
      <Host style={{display: this.open ? 'block' : 'none'}}>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
            <div class="heading">Upload attachment</div>

            {this.decodedFiles.length < 1 ? (
              <div
                class={{'drop-target': true, 'dragging-over': this.draggingOver}}
                onDragOver={e => this.handleDragOver(e)}
                onDragLeave={e => this.handleDragLeave(e)}
                onDrop={e => this.handleDrop(e)}
              >
                <p>Drag and drop a file here...</p>
                <p>- or -</p>

                <verdocs-button label="Select a file..." onClick={() => this.handleSelectFile()} />
                <input type="file" ref={el => (this.fileInput = el as HTMLInputElement)} style={{display: 'none'}} onChange={e => this.handleFileChange(e)} />
              </div>
            ) : (
              <div class="attachments">
                {this.decodedFiles.map((file, index) => (
                  <div class="attachment">
                    <div class="icon" innerHTML={Paperclip} />
                    <div class="name">{file.name}</div>
                    <div class="icon trash" innerHTML={Trash} onClick={() => this.handleRemoveAttachment(index)} />
                  </div>
                ))}
              </div>
            )}

            <div class="buttons">
              <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
              <verdocs-button label="Done" onClick={() => this.handleDone()} disabled={this.decodedFiles.length < 1} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
