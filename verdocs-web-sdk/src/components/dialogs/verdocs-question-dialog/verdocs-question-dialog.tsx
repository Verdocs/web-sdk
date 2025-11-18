import {Component, h, Event, EventEmitter, State, Prop} from '@stencil/core';

const QuestionIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.4809 13.8423H15.4C16.2962 13.8423 17 13.1288 17 12.2764V5.56582C17 4.71348 16.2962 4 15.4 4H4.6C3.70383 4 3 4.71348 3 5.56582V12.2764C3 13.1288 3.70383 13.8423 4.6 13.8423H6.19908L6.2 17L6.20346 16.9997L6.20502 16.9988L10.4809 13.8423ZM6.79895 17.8034C6.35668 18.1298 5.73 18.0406 5.39921 17.6042C5.26989 17.4335 5.2 17.2262 5.2 17.0133L5.19937 14.8423H4.6C3.16406 14.8423 2 13.6935 2 12.2764V5.56582C2 4.14876 3.16406 3 4.6 3H15.4C16.8359 3 18 4.14876 18 5.56582V12.2764C18 13.6935 16.8359 14.8423 15.4 14.8423H10.81L6.79895 17.8034Z" fill="#ffffff"/></svg>`;

/**
 * Display a simple text dialog box with an Ok button. This adds a partially-transparent overlay and screen-centered dialog
 * box with a message and optional header/title. An OK button is shown that will dismiss the message.
 * It can also be dismissed by clicking the background overlay.
 */
@Component({
  tag: 'verdocs-question-dialog',
  styleUrl: 'verdocs-question-dialog.scss',
})
export class VerdocsQuestionDialog {
  @Prop({mutable: true}) question: string = '';

  /**
   * Event fired when the user clicks the OK button.
   */
  @Event({composed: true}) next: EventEmitter<{question: string}>;

  /**
   * Event fired when Cancel is pressed. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  @State() closed = false;

  handleOk() {
    this.next.emit({question: this.question});
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
          <div class="icon" innerHTML={QuestionIcon} />

          <div class="title">Ask the Sender a Question</div>
        </div>

        <div slot="content" class="content">
          <textarea name="question" rows={6} placeholder="Enter your question..." onInput={(e: any) => (this.question = e.target.value)}>
            {this.question}
          </textarea>
        </div>

        <div class="footer" slot="footer">
          <div class="buttons">
            <button class="cancel" onClick={() => this.handleCancel()}>
              Cancel
            </button>
            <button class={'ok'} onClick={() => this.handleOk()}>
              OK
            </button>
          </div>
        </div>
      </verdocs-dialog>
    );
  }
}
