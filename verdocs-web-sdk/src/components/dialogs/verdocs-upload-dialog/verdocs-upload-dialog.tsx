import {fileToDataUrl, IFileWithData} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Host, State} from '@stencil/core';

const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;

const PaperclipIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>`;

/**
 * Display a file upload tool. Note that the file is not actually transmitted, so it may be used by
 * callers with a variety of workflows. Instead, data about the chosen file will be passed to the
 * caller via the onNext event handler.
 */
@Component({
  tag: 'verdocs-upload-dialog',
  styleUrl: 'verdocs-upload-dialog.scss',
})
export class VerdocsUploadDialog {
  private fileInput?: HTMLInputElement;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired when the dialog is closed. The event data will contain the file selected.
   */
  @Event({composed: true}) next: EventEmitter<IFileWithData[]>;

  @State() draggingOver = false;

  @State() decodedFiles = [] as IFileWithData[];

  handleCancel() {
    this.exit.emit();
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.className === 'background-overlay') {
      e.preventDefault();
      this.handleCancel();
    }
  }

  handleDone() {
    this.next.emit(this.decodedFiles);
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

  async handleFileChange() {
    let droppedFiles = [] as File[];
    for (let i = 0; i < this.fileInput?.files.length; i++) {
      droppedFiles.push(this.fileInput?.files[i]);
    }
    this.decodedFiles = await Promise.all(droppedFiles.map(fileToDataUrl));
  }

  render() {
    return (
      <Host>
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
                <input type="file" ref={el => (this.fileInput = el as HTMLInputElement)} style={{display: 'none'}} onChange={() => this.handleFileChange()} />
              </div>
            ) : (
              <div class="attachments">
                {this.decodedFiles.map((file, index) => (
                  <div class="attachment">
                    <div class="icon" innerHTML={PaperclipIcon} />
                    <div class="name">{file.name}</div>
                    <div class="icon trash" innerHTML={TrashIcon} onClick={() => this.handleRemoveAttachment(index)} />
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
