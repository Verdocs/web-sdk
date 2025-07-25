import {Component, Prop, h, Event, EventEmitter, State} from '@stencil/core';

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
   * Override the "OK" button's label
   */
  @Prop() buttonLabel: string = 'OK';

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
   * Event fired when Cancel is pressed. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
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
      <verdocs-dialog onExit={e => this.handleDismiss(e)}>
        <div slot="heading" class="heading">
          <div class="icon">
            <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_34208_4881)">
                <path
                  d="M3.125 0.75C1.88398 0.75 0.875 1.75898 0.875 3V16.5C0.875 17.741 1.88398 18.75 3.125 18.75H12.125C13.366 18.75 14.375 17.741 14.375 16.5V15.8215C14.2801 15.8602 14.1852 15.8918 14.0867 15.9164L11.9738 16.4437C11.8684 16.4684 11.7629 16.4859 11.6574 16.493C11.6258 16.4965 11.5941 16.5 11.5625 16.5H9.3125C9.09805 16.5 8.90469 16.3805 8.80977 16.1906L8.50039 15.5684C8.44062 15.4488 8.32109 15.375 8.19102 15.375C8.06094 15.375 7.93789 15.4488 7.88164 15.5684L7.57227 16.1906C7.47031 16.398 7.24883 16.5211 7.02031 16.5C6.7918 16.4789 6.59492 16.3207 6.53164 16.1027L5.9375 14.1445L5.59297 15.2977C5.37852 16.0113 4.72109 16.5 3.97578 16.5H3.6875C3.37812 16.5 3.125 16.2469 3.125 15.9375C3.125 15.6281 3.37812 15.375 3.6875 15.375H3.97578C4.22539 15.375 4.44336 15.2133 4.51367 14.9742L5.0375 13.234C5.15703 12.8367 5.52266 12.5625 5.9375 12.5625C6.35234 12.5625 6.71797 12.8367 6.8375 13.234L7.24531 14.591C7.50547 14.373 7.83594 14.25 8.1875 14.25C8.74648 14.25 9.25625 14.5664 9.50586 15.0656L9.66055 15.375H9.97344C9.86445 15.0656 9.84336 14.7281 9.92422 14.3977L10.4516 12.2848C10.55 11.8875 10.7539 11.5289 11.0422 11.2406L14.375 7.90781V6.375H9.875C9.25273 6.375 8.75 5.87227 8.75 5.25V0.75H3.125ZM9.875 0.75V5.25H14.375L9.875 0.75ZM20.2039 5.66133C19.6555 5.11289 18.766 5.11289 18.2141 5.66133L17.1805 6.69492L19.6766 9.19102L20.7102 8.15742C21.2586 7.60898 21.2586 6.71953 20.7102 6.16758L20.2039 5.66133ZM11.8402 12.0352C11.6961 12.1793 11.5941 12.3586 11.5449 12.559L11.0176 14.6719C10.9684 14.8652 11.0246 15.0656 11.1652 15.2063C11.3059 15.3469 11.5062 15.4031 11.6996 15.3539L13.8125 14.8266C14.0094 14.7773 14.1922 14.6754 14.3363 14.5312L18.8785 9.98555L16.3824 7.48945L11.8402 12.0352Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_34208_4881">
                  <path d="M0.875 0.75H21.125V18.75H0.875V0.75Z" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div class="title"> {this.heading}</div>
        </div>

        <div slot="content" class="content" innerHTML={this.message} />

        <div class="footer" slot="footer">
          <div class="buttons">
            {this.showCancel && (
              <button class="cancel" onClick={() => this.handleCancel()}>
                Cancel
              </button>
            )}
            <button class={!this.showCancel ? 'ok single' : 'ok'} onClick={() => this.handleOk()}>
              OK
            </button>
          </div>
        </div>
      </verdocs-dialog>
    );
  }
}
