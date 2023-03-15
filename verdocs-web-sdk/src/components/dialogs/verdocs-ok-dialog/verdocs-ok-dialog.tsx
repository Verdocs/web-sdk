import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';

/**
 * Display a simple text dialog box with an Ok button. This adds a partially-transparent overlay and screen-centered dialog
 * box with a message and optional header/title. An OK button is shown that will dismiss the message.
 * It can also be dismissed by clicking the background overlay.
 */
@Component({
  tag: 'verdocs-ok-dialog',
  styleUrl: 'verdocs-ok-dialog.scss',
})
export class VerdocsOkDialog {
  /**
   * The title of the dialog. "title" is a reserved word, so we use heading.
   */
  @Prop() heading: string = '';

  /**
   * The message content to display.
   */
  @Prop() message: string = '';

  /**
   * If set, a cancel button will also be displayed. Note that the dialog is always cancelable by clicking the background
   * overlay to dismiss it.
   */
  @Prop() showCancel: boolean = false;

  /**
   * Event fired when the user clicks the OK button.
   */
  @Event({composed: true}) next: EventEmitter;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  @State() closed = false;

  handleOk() {
    this.next.emit();
  }

  handleCancel() {
    this.exit.emit();
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    this.closed = true;
    if (e.target.className === 'background-overlay') {
      e.preventDefault();
      this.exit.emit();
    }
  }

  render() {
    return (
      <Host class={this.closed ? 'closed' : ''}>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
            <div class="heading">{this.heading}</div>
            <div class="content">
              <div class="message" innerHTML={this.message} />

              <div class="buttons">
                {this.showCancel ? <verdocs-button label="CANCEL" variant="outline" onClick={() => this.handleCancel()} /> : <div style={{display: 'none'}} />}
                <verdocs-button label="OK" onClick={() => this.handleOk()} />
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
