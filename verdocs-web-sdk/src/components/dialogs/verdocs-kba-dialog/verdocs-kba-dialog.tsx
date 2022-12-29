import {Component, Prop, h, Event, EventEmitter, Fragment, Host, State} from '@stencil/core';
import Question from './question.svg';

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
  @Event({composed: true}) done: EventEmitter<string>;

  @State() response = '';

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
    this.done.emit(this.response);
    this.open = false;
  }

  render() {
    return (
      <Host style={{display: this.open ? 'block' : 'none'}}>
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
              <div class="help-icon" innerHTML={Question} />
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
