import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';
import {ISignerTokenResponse, VerdocsEndpoint, verifySigner} from '@verdocs/js-sdk';
import {DefaultEndpoint} from '../../../utils/Environment';
import {VerdocsToast} from '../../../utils/Toast';

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
        <verdocs-dialog persistent onExit={() => this.handleCancel()}>
          <div slot="heading" class="heading">
            <div class="title">Verification Required</div>
          </div>

          <div slot="content" class="content">
            <div class="help-box">
              <div class="help-details">
                <div class="help-text">Please check your messages for a one-time code. If you did not receive it, be sure to check your Spam/Junk folder.</div>
              </div>
            </div>

            <verdocs-text-input
              id="verdocs-otp-input"
              value={this.response}
              onClick={e => e.stopPropagation()}
              placeholder="Enter your one-time code..."
              onInput={(e: any) => (this.response = e.target.value)}
            />
          </div>

          <div slot="footer" class="buttons footer">
            <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
            <verdocs-button label={'Resend'} onClick={() => this.handleResend()} disabled={this.resendDisabled} />
            <verdocs-button label={'Submit'} onClick={() => this.handleSubmit()} disabled={!this.response} />
          </div>
        </verdocs-dialog>
      </Host>
    );
  }
}
