import {DEFAULT_DISCLOSURES} from '@verdocs/js-sdk';
import {Component, Prop, h, Event, EventEmitter, State} from '@stencil/core';

/**
 * Display e-signing disclosures with options to delegate, decline or proceed.
 */
@Component({
  tag: 'verdocs-disclosure-dialog',
  styleUrl: 'verdocs-disclosure-dialog.scss',
})
export class VerdocsDisclosureDialog {
  /**
   * The disclosures to display.
   */
  @Prop() disclosures: string = DEFAULT_DISCLOSURES;

  /**
   * If the recipient may delegate, an additional button will be shown to drive this flow.
   */
  @Prop() delegator = false;

  /**
   * Event fired when the user chooses to decline.
   */
  @Event({composed: true}) decline: EventEmitter<{first_name: string; last_name: string; email: string; phone: string; message: string}>;

  /**
   * Event fired when the user chooses to delegate signing.
   */
  @Event({composed: true}) delegate: EventEmitter<{first_name: string; last_name: string; email: string; phone: string; message: string}>;

  /**
   * Event fired when the user chooses to proceed.
   */
  @Event({composed: true}) accept: EventEmitter<{first_name: string; last_name: string; email: string; phone: string; message: string}>;

  @State() accepted = false;

  render() {
    return (
      <verdocs-dialog>
        <div slot="heading" class="heading">
          <div class="title">e-Signature Disclosures</div>
          <div class="close-button">
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.39705 8.55379L4.46967 8.46967C4.73594 8.2034 5.1526 8.1792 5.44621 8.39705L5.53033 8.46967L12 14.939L18.4697 8.46967C18.7626 8.17678 19.2374 8.17678 19.5303 8.46967C19.8232 8.76256 19.8232 9.23744 19.5303 9.53033L13.061 16L19.5303 22.4697C19.7966 22.7359 19.8208 23.1526 19.6029 23.4462L19.5303 23.5303C19.2641 23.7966 18.8474 23.8208 18.5538 23.6029L18.4697 23.5303L12 17.061L5.53033 23.5303C5.23744 23.8232 4.76256 23.8232 4.46967 23.5303C4.17678 23.2374 4.17678 22.7626 4.46967 22.4697L10.939 16L4.46967 9.53033C4.2034 9.26406 4.1792 8.8474 4.39705 8.55379L4.46967 8.46967L4.39705 8.55379Z" />
            </svg>
          </div>
        </div>

        <div slot="content" class="content">
          <div innerHTML={this.disclosures}></div>
          <div class="accept">
            <verdocs-checkbox
              label="I accept the electronic signature disclosures and agree to proceed with digital signing."
              checked={this.accepted}
              onInput={() => (this.accepted = !this.accepted)}
            />
          </div>
        </div>

        <div class="footer" slot="footer">
          {this.delegator ? (
            <div class="buttons">
              <button class="decline" onClick={() => this.decline.emit()}>
                Decline
              </button>
              <button class="delegate" onClick={() => this.delegate.emit()}>
                Delegate
              </button>
              <button class="proceed" onClick={() => this.accept.emit()} disabled={!this.accepted}>
                Proceed
              </button>
            </div>
          ) : (
            <div class="buttons">
              <button class="decline" onClick={() => this.decline.emit()}>
                Decline
              </button>
              <button class="proceed" onClick={() => this.accept.emit()} disabled={!this.accepted}>
                Proceed
              </button>
            </div>
          )}
        </div>
      </verdocs-dialog>
    );
  }
}
