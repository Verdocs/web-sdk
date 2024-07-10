import {Component, h, Event, EventEmitter, Host} from '@stencil/core';

/**
 * Display a simple dialog where the contents are provided via slots.
 */
@Component({
  tag: 'verdocs-dialog',
  styleUrl: 'verdocs-dialog.scss',
})
export class VerdocsDialog {
  /**
   * Event fired when the dialog is dismissed by clicking the background overlay.
   */
  @Event({composed: true}) exit: EventEmitter;

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.className === 'background-overlay') {
      e.preventDefault();
      this.exit?.emit();
    }
  }

  render() {
    return (
      <Host>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
            <slot name="title">
              <div class="heading">Please Confirm</div>
            </slot>

            <div class="content">
              <slot></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
