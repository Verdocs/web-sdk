import {Component, h, Event, EventEmitter, Fragment, Host, State, Prop} from '@stencil/core';

const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;

const PaperclipIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>`;

/**
 * Display a file upload tool. Note that the file is not actually transmitted, so it may be used by
 * callers with a variety of workflows. Instead, data about the chosen file will be passed to the
 * caller via the onNext event handler. A delete event is also exposed to delete existing attachments.
 * To represent an existing attachment, set the existingFile property.
 */
@Component({
  tag: 'verdocs-upload-dialog',
  styleUrl: 'verdocs-upload-dialog.scss',
})
export class VerdocsUploadDialog {
  private fileInput?: HTMLInputElement;

  @Prop({mutable: true})
  existingFile: any;
  // existingFile: File;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired when the dialog is closed. The event data will contain the file selected.
   */
  @Event({composed: true}) next: EventEmitter<File[]>;

  /**
   * Event fired when an existing attachment is deleted. The parent component is
   * responsible for the actual removal.
   */
  @Event({composed: true}) remove: EventEmitter;

  @State() draggingOver = false;
  @State() confirmDelete = false;
  @State() selectedFiles = [] as File[];

  handleCancel() {
    this.exit.emit();
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.class === 'background-overlay') {
      e.preventDefault();
      this.handleCancel();
    }
  }

  handleDone() {
    this.next.emit(this.selectedFiles);
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

    this.selectedFiles = Array.from(e.dataTransfer.items);
  }

  handleRemoveAttachment(index: number) {
    const newFiles = [...this.selectedFiles];
    newFiles.splice(index, 1);
    this.selectedFiles = newFiles;
  }

  handleDeleteAttachment(e: any) {
    // Stop the parent from seeing "next" and thinking an upload was done.
    // TODO: Rethink having so many commonalities in nested dialogs (next/exit).
    e.preventDefault();
    e.stopPropagation();

    this.remove?.emit();
    this.existingFile = null;
    this.confirmDelete = false;
  }

  handleSelectFile() {
    this.fileInput?.click();
  }

  async handleFileChange() {
    this.selectedFiles = Array.from(this.fileInput?.files);
    let droppedFiles = [] as File[];
    for (let i = 0; i < this.fileInput?.files.length; i++) {
      droppedFiles.push(this.fileInput?.files[i]);
    }
  }

  render() {
    const existingFile = this.existingFile?.name ? this.existingFile : null;

    return (
      <Host>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="upload-dialog-content">
            <div class="heading">Upload attachment</div>

            {this.selectedFiles.length < 1 && existingFile && (
              <Fragment>
                <div class="current-label">Current Attachment</div>
                <div class="attachments" style={{marginTop: '0'}}>
                  <div class="attachment">
                    <div class="icon" innerHTML={PaperclipIcon} />
                    <div class="name">{existingFile.name}</div>
                    <div class="icon trash" innerHTML={TrashIcon} onClick={() => (this.confirmDelete = true)} />
                  </div>
                </div>
              </Fragment>
            )}

            {this.selectedFiles.length < 1 && !existingFile && (
              <div
                class={{'drop-target': true, 'dragging-over': this.draggingOver}}
                onDragOver={e => this.handleDragOver(e)}
                onDragLeave={e => this.handleDragLeave(e)}
                onDrop={e => this.handleDrop(e)}
              >
                <p>Drag and drop a {!!existingFile && 'replacement'} here...</p>
                <p>- or -</p>

                <verdocs-button label={!!existingFile ? 'Replace file...' : 'Select a file...'} onClick={() => this.handleSelectFile()} />
                <input type="file" ref={el => (this.fileInput = el as HTMLInputElement)} style={{display: 'none'}} onChange={() => this.handleFileChange()} />
              </div>
            )}

            {this.selectedFiles.length > 0 && (
              <div class="attachments">
                {this.selectedFiles.map((file, index) => (
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
              <verdocs-button label="Upload" onClick={() => this.handleDone()} disabled={this.selectedFiles.length < 1} />
            </div>
          </div>
        </div>

        {this.confirmDelete && (
          <verdocs-ok-dialog
            heading="Delete Attachment?"
            message="Are you sure you wish to delete this attachment? This action cannot be undone."
            showCancel={true}
            onExit={e => {
              // So we don't close the upload dialog
              e.preventDefault();
              e.stopPropagation();
              this.confirmDelete = false;
            }}
            onNext={e => this.handleDeleteAttachment(e)}
          />
        )}
      </Host>
    );
  }
}
