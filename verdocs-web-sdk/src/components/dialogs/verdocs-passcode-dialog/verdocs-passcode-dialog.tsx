import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';
import {ISignerTokenResponse, VerdocsEndpoint, verifySigner} from '@verdocs/js-sdk';
import {DefaultEndpoint} from '../../../utils/Environment';
import {VerdocsToast} from '../../../utils/Toast';

/**
 * Prompt the user to confirm their identity with a passcode.
 */
@Component({
  tag: 'verdocs-passcode-dialog',
  styleUrl: 'verdocs-passcode-dialog.scss',
})
export class VerdocsPasscodeDialog {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop({mutable: true}) endpoint: VerdocsEndpoint = DefaultEndpoint;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired when the process has completed successfully.
   */
  @Event({composed: true}) next: EventEmitter<{response: ISignerTokenResponse}>;

  @State() response = '';

  handleCancel() {
    this.exit.emit();
  }

  handleSubmit() {
    verifySigner(this.endpoint, {auth_method: 'passcode', code: this.response})
      .then(response => {
        console.log('Verification completed', response);
        this.next.emit({response});
      })
      .catch(e => {
        VerdocsToast('Invalid passcode. Please try again.');
        console.log('Invalid code', e);
      });

    this.response = '';
  }

  render() {
    return (
      <Host>
        <verdocs-dialog persistent onExit={() => this.handleCancel()}>
          <div slot="heading" class="heading">
            <div class="title">Passcode Required</div>
          </div>

          <div slot="content" class="content">
            <div class="help-box">
              <div class="help-details">
                <div class="help-text">This document is protected by a passcode. Please enter it below to proceed. If you do not have one, please contact the sender.</div>
              </div>
            </div>

            <verdocs-text-input
              id="verdocs-passcode-input"
              value={this.response}
              onClick={e => e.stopPropagation()}
              placeholder="Enter passcode..."
              onInput={(e: any) => (this.response = e.target.value)}
            />
          </div>

          <div slot="footer" class="buttons footer">
            <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
            <verdocs-button label={'Submit'} onClick={() => this.handleSubmit()} disabled={!this.response} />
          </div>
        </verdocs-dialog>
      </Host>
    );
  }
}
