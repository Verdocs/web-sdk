import {Component, Prop, h, Event, EventEmitter, Fragment, Host, State} from '@stencil/core';

const QuestionIcon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C8.95313 0 0 8.95313 0 20C0 31.0469 8.95313 40 20 40C31.0469 40 40 31.0469 40 20C40 8.95313 31.0469 0 20 0ZM20 36.25C11.0391 36.25 3.75 28.9602 3.75 20C3.75 11.0398 11.0391 3.75 20 3.75C28.9609 3.75 36.25 11.0398 36.25 20C36.25 28.9602 28.9609 36.25 20 36.25Z" fill="white"/><path d="M20 26.25C18.5938 26.25 17.5 27.3438 17.5 28.75C17.5 30.1562 18.5234 31.25 20 31.25C21.3359 31.25 22.5 30.1562 22.5 28.75C22.5 27.3438 21.3359 26.25 20 26.25ZM22.5859 10H18.5938C15.5469 10 13.125 12.4219 13.125 15.4688C13.125 16.4844 13.9844 17.3438 15 17.3438C16.0156 17.3438 16.875 16.4844 16.875 15.4688C16.875 14.5312 17.5859 13.75 18.5234 13.75H22.5156C23.5234 13.75 24.375 14.5312 24.375 15.4688C24.375 16.0938 24.0625 16.5703 23.5156 16.8828L19.0625 19.6094C18.4375 20 18.125 20.625 18.125 21.25V22.5C18.125 23.5156 18.9844 24.375 20 24.375C21.0156 24.375 21.875 23.5156 21.875 22.5V22.3438L25.3984 20.1562C27.0391 19.1406 28.0547 17.3438 28.0547 15.4688C28.125 12.4219 25.7031 10 22.5859 10Z" fill="#E7E7E7"/></svg>`;

/**
 * Display a text input field. This adds a partially-transparent overlay and screen-centered dialog
 * box with a message and optional header/title. An OK button is shown that will dismiss the message.
 * It can also be dismissed by clicking the background overlay.
 */
@Component({
  tag: 'verdocs-kba-dialog',
  styleUrl: 'verdocs-kba-dialog.scss',
})
export class VerdocsKbaDialog {
  /**
   * Which step this confirmation is for, in a multi-step process. Ignored if `steps` is < 2.
   */
  @Prop() step: number = 1;

  /**
   * How many steps exist in a multi-step process. Set to 1 for a single-step process (hides the indicator).
   */
  @Prop() steps: number = 3;

  /**
   * If set, a help/instructions box will be displayed with this title
   */
  @Prop() helptitle: string = 'One Time Code';

  /**
   * If set, a help/instructions box will be displayed with this text
   */
  @Prop() helptext: string = 'Please check your text messages for a security code, and enter the code below.';

  /**
   * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
   */
  @Prop() mode: 'text' | 'choice' = 'choice';

  /**
   * For text input challenges, the label to display next to the input field.
   */
  @Prop() label: string = 'PIN';

  /**
   * For text input challenges, the placeholder to display inside the input field.
   */
  @Prop() placeholder: string = 'Enter your PIN...';

  /**
   * For choice challenges, a set of choices to choose from. 6 choices is recommended to fit most screen sizes.
   */
  @Prop() choices: string[] = ['553 Arbor Dr', '18 Lacey Ln', '23A Ball Ct', '2375 Cavallo Blvd', '23-1 RR-7', '151 Boulder Rd'];

  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired when the dialog is closed. The event data will contain the value selected.
   */
  @Event({composed: true}) next: EventEmitter<string>;

  @State() response = '';

  handleCancel() {
    this.cancel.emit();
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.className === 'background-overlay') {
      e.preventDefault();
      this.handleCancel();
    }
  }

  handleDone() {
    this.next.emit(this.response);
  }

  render() {
    return (
      <Host>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
            <div class="heading">
              Confirm Your Identity
              {this.steps > 1 ? (
                <span class="step">
                  ({this.step}/{this.steps})
                </span>
              ) : (
                <Fragment />
              )}
            </div>

            <div class="help-box">
              <div class="help-icon" innerHTML={QuestionIcon} />
              <div class="help-details">
                <div class="help-title">{this.helptitle}</div>
                <div class="help-text">{this.helptext}</div>
              </div>
            </div>

            {this.mode === 'choice' ? (
              <div class="choices">
                {this.choices.map(choice => (
                  <div
                    class={`choice ${choice === this.response ? 'selected' : ''}`}
                    onClick={() => {
                      this.response = choice;
                    }}
                  >
                    {choice}
                  </div>
                ))}
              </div>
            ) : (
              <div class="input">
                <label htmlFor="verdocs-kba-input">{this.label}</label>
                <input type="text" id="verdocs-kba-input" name="verdocs-kba-input" placeholder={this.placeholder} />
              </div>
            )}

            <div class="buttons">
              <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
              <verdocs-button label="Done" onClick={() => this.handleDone()} disabled={!this.response} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
