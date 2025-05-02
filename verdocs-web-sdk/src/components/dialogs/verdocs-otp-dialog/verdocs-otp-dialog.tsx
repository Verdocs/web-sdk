import {IRecipient, ISignerTokenResponse, VerdocsEndpoint, verifySigner} from '@verdocs/js-sdk';
import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';
import {DefaultEndpoint} from '../../../utils/Environment';
import {VerdocsToast} from '../../../utils/Toast';

const QuestionIcon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C8.95313 0 0 8.95313 0 20C0 31.0469 8.95313 40 20 40C31.0469 40 40 31.0469 40 20C40 8.95313 31.0469 0 20 0ZM20 36.25C11.0391 36.25 3.75 28.9602 3.75 20C3.75 11.0398 11.0391 3.75 20 3.75C28.9609 3.75 36.25 11.0398 36.25 20C36.25 28.9602 28.9609 36.25 20 36.25Z" fill="white"/><path d="M20 26.25C18.5938 26.25 17.5 27.3438 17.5 28.75C17.5 30.1562 18.5234 31.25 20 31.25C21.3359 31.25 22.5 30.1562 22.5 28.75C22.5 27.3438 21.3359 26.25 20 26.25ZM22.5859 10H18.5938C15.5469 10 13.125 12.4219 13.125 15.4688C13.125 16.4844 13.9844 17.3438 15 17.3438C16.0156 17.3438 16.875 16.4844 16.875 15.4688C16.875 14.5312 17.5859 13.75 18.5234 13.75H22.5156C23.5234 13.75 24.375 14.5312 24.375 15.4688C24.375 16.0938 24.0625 16.5703 23.5156 16.8828L19.0625 19.6094C18.4375 20 18.125 20.625 18.125 21.25V22.5C18.125 23.5156 18.9844 24.375 20 24.375C21.0156 24.375 21.875 23.5156 21.875 22.5V22.3438L25.3984 20.1562C27.0391 19.1406 28.0547 17.3438 28.0547 15.4688C28.125 12.4219 25.7031 10 22.5859 10Z" fill="#E7E7E7"/></svg>`;

/**
 * Prompt the user to confirm their identity with a one time code via email/SMS.
 */
@Component({
  tag: 'verdocs-otp-dialog',
  styleUrl: 'verdocs-otp-dialog.scss',
})
export class VerdocsOtpDialog {
  private resendTimeout: any = null;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop({mutable: true}) endpoint: VerdocsEndpoint = DefaultEndpoint;

  /**
   * The type of dialog to display. Three modes are supported.
   */
  @Prop() method: 'email' | 'sms' = 'email';

  /**
   * For identity confirmation, the current recipient details.
   */
  @Prop() recipient: IRecipient | null = null;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired when the process has completed successfully.
   */
  @Event({composed: true}) next: EventEmitter<{response: ISignerTokenResponse}>;

  @State() resendDisabled = true;
  @State() response = '';

  componentDidLoad() {
    this.startResendTimeout();

    // Give the parent time to finish what it's doing.
    setTimeout(() => {
      verifySigner(this.endpoint, {auth_method: this.method, code: '', resend: true})
        .then(r => {
          console.log('Resend result', r);
          this.response = '';
        })
        .catch(e => console.log('Error resending code', e));
    }, 1000);
  }

  disconnectedCallback() {
    if (this.resendTimeout) {
      clearTimeout(this.resendTimeout);
      this.resendTimeout = null;
    }
  }

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

  startResendTimeout() {
    this.resendDisabled = true;

    if (this.resendTimeout) {
      clearTimeout(this.resendTimeout);
    }

    this.resendTimeout = setTimeout(() => {
      this.resendDisabled = false;
    }, 30000);
  }

  handleResend() {
    this.startResendTimeout();
    verifySigner(this.endpoint, {auth_method: this.method, code: '', resend: true})
      .then(r => {
        console.log('Resend result', r);
        this.response = '';
        VerdocsToast('A new code has been sent.');
      })
      .catch(e => console.log('Error resending code', e));
  }

  handleSubmit() {
    this.startResendTimeout();
    verifySigner(this.endpoint, {auth_method: this.method, code: this.response})
      .then(response => {
        console.log('Verification completed', response);
        this.next.emit({response});
        VerdocsToast('Thank you. Your verification was successful.');
      })
      .catch(e => {
        VerdocsToast('Invalid verification code. Please try again.');
        console.log('Invalid code', e);
      });

    this.response = '';
  }

  render() {
    return (
      <Host>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
            <div class="heading">Verification Required</div>

            <div class="help-box">
              <div class="help-icon" innerHTML={QuestionIcon} />
              <div class="help-details">
                <div class="help-title">Please verify your email address</div>
                <div class="help-text">Check your email for a one-time code, and enter it below.</div>
              </div>
            </div>

            <div class="input">
              <label htmlFor="verdocs-otp-input">Code:</label>
              <input
                type="text"
                id="verdocs-otp-input"
                name="verdocs-otp-input"
                placeholder="Enter your one-time code..."
                value={this.response}
                onInput={(e: any) => (this.response = e.target.value)}
              />
            </div>

            <div class="buttons">
              <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
              <verdocs-button label={'Resend'} onClick={() => this.handleResend()} disabled={this.resendDisabled} />
              <verdocs-button label={'Submit'} onClick={() => this.handleSubmit()} disabled={!this.response} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
