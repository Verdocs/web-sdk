import {Component, h, Event, EventEmitter} from '@stencil/core';

/**
 * Display a simple dialog letting an approver know they are being asked to review and approve the document. An "Okay"
 * button and a close button are shown, both of which dismiss the dialog.
 */
@Component({
  tag: 'verdocs-approver-dialog',
  styleUrl: 'verdocs-approver-dialog.scss',
})
export class VerdocsApproverDialog {
  /**
   * Event fired when the user clicks the Okay button.
   */
  @Event({composed: true}) next: EventEmitter;

  /**
   * Event fired when the dialog is closed via the close button or background overlay. This is called exit to avoid
   * conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  // verdocs-dialog's own exit event would otherwise bubble up alongside ours, so we stop it and re-emit once
  handleExit(e: any) {
    e.stopPropagation();
    this.exit.emit();
  }

  render() {
    return (
      <verdocs-dialog onExit={e => this.handleExit(e)}>
        <div slot="heading" class="heading">
          <div class="title">Approval Required</div>
        </div>

        <div slot="content" class="content">
        You have been designated as an approver. Please review the document and approve it when you’re ready.
        </div>

        <div class="footer" slot="footer">
          <div class="buttons">
            <button class="ok" onClick={() => this.next.emit()}>
              Okay
            </button>
          </div>
        </div>
      </verdocs-dialog>
    );
  }
}
