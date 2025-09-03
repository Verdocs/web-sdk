import {Component, Prop, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {getEnvelope, IEnvelope, IRecipient, VerdocsEndpoint} from '@verdocs/js-sdk';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';
import { VerdocsToast } from '../../../utils/Toast';

/**
 * Displays a single recipient from an envelope, with the opportunity to copy an in-person
 * signing link for that recipient to use.
 */
@Component({
  tag: 'verdocs-envelope-update-recipient',
  styleUrl: 'verdocs-envelope-update-recipient.scss',
})
export class VerdocsEnvelopeUpdateRecipient {
  private envelopeListenerId = null;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The envelope ID to edit.
   */
  @Prop() envelopeId: string = '';

  /**
   * The role to load.
   */
  @Prop() roleName: string = '';

  /**
   * Should the field be disabled?
   */
  @Prop() disabled: boolean = false;

  /**
   * Event fired when the user clicks Done to proceed. It is up to the host application
   * to save any updates and proceed to the next step.
   */
  @Event({composed: true}) next: EventEmitter<{action: 'cancel' | 'save'; originalRecipient: IRecipient; updatedRecipient: IRecipient}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() isOpen: boolean;
  @State() gettingLink = true;
  @State() link = '';

  @State() loading = true;
  @State() envelope: IEnvelope | null = null;
  @State() originalRecipient: IRecipient | null = null;
  @State() updatedRecipient: IRecipient | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.envelopeId) {
        console.log(`[UPDATE_RECIPIENT] Missing required envelope ID ${this.envelopeId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[UPDATE_RECIPIENT] Unable to start session, must be authenticated');
        return;
      }

      this.listenToEnvelope();
    } catch (e) {
      console.log('[UPDATE_RECIPIENT] Error loading envelope', e);
      VerdocsToast('Unable to load template: ' + e.message, {style: 'error'});
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  disconnectedCallback() {
    this.unlistenToEnvelope();
  }

  async listenToEnvelope() {
    console.log('[UPDATE_RECIPIENT] Loading envelope', this.envelopeId);
    this.unlistenToEnvelope();
    Store.subscribe(
      'envelopes',
      this.envelopeId,
      () => getEnvelope(this.endpoint, this.envelopeId),
      false,
      (envelope: IEnvelope) => {
        this.envelope = envelope;
        this.loading = false;

        const recipient = (this.envelope?.recipients || []).find(r => r.role_name === this.roleName);
        this.originalRecipient = recipient;
        this.updatedRecipient = {...recipient};
      },
    );
  }

  unlistenToEnvelope() {
    if (this.envelopeListenerId) {
      Store.store.delListener(this.envelopeListenerId);
      this.envelopeListenerId = null;
    }
  }

  handleSave(e: any) {
    e.preventDefault();
    this.next?.emit({action: 'save', originalRecipient: this.originalRecipient, updatedRecipient: this.updatedRecipient});
  }

  handleCancel(e: any) {
    e.preventDefault();
    this.next?.emit({action: 'cancel', originalRecipient: this.originalRecipient, updatedRecipient: this.updatedRecipient});
  }

  render() {
    if (this.loading || !this.updatedRecipient) {
      return <Host />;
    }

    return (
      <Host>
        <div class="summary-content">
          <h1 class="summary-title">Update Recipient</h1>
          <div class="summary-rows">
            <div class="fields">
              <div class="role-name">{this.updatedRecipient.role_name}</div>

              <div class="field">
                <div class="fields-row">
                  <verdocs-text-input
                    value={this.updatedRecipient.first_name}
                    placeholder="First Name..."
                    onInput={(e: any) => (this.updatedRecipient.first_name = e.target.value)}
                  />
                  <verdocs-text-input value={this.updatedRecipient.last_name} placeholder="Last Name..." onInput={(e: any) => (this.updatedRecipient.last_name = e.target.value)} />
                </div>
              </div>

              <div class="field">
                <verdocs-text-input
                  type="email"
                  value={this.updatedRecipient.email}
                  placeholder="Email Address..."
                  onInput={(e: any) => (this.updatedRecipient.email = e.target.value)}
                />
              </div>

              <div class="field">
                <verdocs-text-input
                  type="tel"
                  value={this.updatedRecipient.phone}
                  placeholder="Phone Number..."
                  onInput={(e: any) => (this.updatedRecipient.phone = e.target.value)}
                />
              </div>

              <div class="field">
                <textarea
                  id="verdocs-contact-picker-message"
                  name="verdocs-contact-picker-message"
                  data-lpignore="true"
                  autocomplete="blocked"
                  placeholder="Optional message to include in invitation..."
                  onInput={(e: any) => (this.updatedRecipient.message = e.target.value)}
                >
                  {this.updatedRecipient.message}
                </textarea>
              </div>

              <div class="note">
                NOTE: If you change the recipient's email address or invite message, they will receive a new invitation to sign the envelope. This will also reset their status if
                they have previously declined to sign.
              </div>
            </div>
          </div>

          <div class="buttons">
            <verdocs-button disabled={this.disabled} variant="outline" size="small" label="Cancel" onClick={e => this.handleCancel(e)} />
            <verdocs-button disabled={this.disabled} size="small" label="Save" onClick={e => this.handleSave(e)} />
          </div>
        </div>
      </Host>
    );
  }
}
