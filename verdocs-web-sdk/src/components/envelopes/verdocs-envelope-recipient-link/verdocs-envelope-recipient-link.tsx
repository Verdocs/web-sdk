import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getInPersonLink} from '@verdocs/js-sdk/Envelopes/Recipients';
import {IEnvelope, IRecipient} from '@verdocs/js-sdk/Envelopes/Types';
import {Component, Prop, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {getEnvelopeStore, TEnvelopeStore} from '../../../utils/EnvelopeStore';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

/**
 * Displays a single recipient from an envelope, with the opportunity to copy an in-person
 * signing link for that recipient to use.
 */
@Component({
  tag: 'verdocs-envelope-recipient-link',
  styleUrl: 'verdocs-envelope-recipient-link.scss',
})
export class VerdocsEnvelopeRecipientLink {
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
   * Event fired when the user clicks Done to proceed. It is up to the host application
   * to redirect the user to the appropriate next workflow step.
   */
  @Event({composed: true}) next: EventEmitter<{envelope: IEnvelope}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() isOpen: boolean;
  @State() loading = true;
  @State() gettingLink = true;
  @State() link = '';

  store: TEnvelopeStore | null = null;
  recipient: IRecipient | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.envelopeId) {
        console.log(`[RECIPIENT_LINK] Missing required envelope ID ${this.envelopeId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[RECIPIENT_LINK] Unable to start session, must be authenticated');
        return;
      }

      this.store = await getEnvelopeStore(this.endpoint, this.envelopeId, true);
      this.loading = false;
      this.gettingLink = true;

      this.recipient = this.store?.state?.recipients?.find(r => r.role_name === this.roleName);

      this.getLink(this.recipient);
    } catch (e) {
      console.log('[RECIPIENT_LINK] Error loading envelope', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleDone(e: any) {
    e.preventDefault();
    this.next?.emit({envelope: this.store.state});
  }

  copyLink(link: string) {
    navigator.clipboard
      .writeText(link)
      .then(() => VerdocsToast('Link copied to clipboard!', {style: 'success', duration: 3000}))
      .catch(e => {
        console.warn('[RECIPIENT_LINK] Error copying to clipboard', e);
        VerdocsToast(`Unable to copy to clipboard: ${e.message}`, {style: 'error'});
      });
  }

  getLink(recipient: IRecipient) {
    this.gettingLink = true;
    getInPersonLink(this.endpoint, recipient.envelope_id, recipient.role_name)
      .then(response => {
        this.gettingLink = false;
        this.link = response.link;
        // NOTE: Left here for documentation purposes. We don't auto-copy the link because many browsers now
        // error on that because we aren't the focus/gesture-initiator since we're a new component just being
        // drawn in the DOM. So we let the user click to trigger that.
        // this.copyLink(response.link);
      })
      .catch(e => {
        this.gettingLink = false;
        console.log('[RECIPIENT_LINK] Error getting link', e);
        VerdocsToast('Unable to get link: ' + e.message, {style: 'error'});
      });
  }

  render() {
    if (this.loading || !this.recipient) {
      return <Host />;
    }

    // const recipientsWithActions = getRecipientsWithActions(this.store.state); const showLinkButton = recipientCanAct(recipient, recipientsWithActions); const link =
    //   this.links[recipient.role_name]; const gettingLink = this.gettingLinks[recipient.role_name]; return (

    return (
      <Host>
        <div class="summary-content">
          <h1 class="summary-title">In-Person Signing Link</h1>
          <div class="summary-rows">
            <div class="summary-recipient">
              <div class="role-name">{this.recipient.role_name}</div>
              <div class="role-details">
                <div class="role-info">
                  <div class="role-full-name">
                    {this.recipient.full_name} ({this.recipient.email || this.recipient.phone})
                  </div>
                  {!this.link && (
                    <verdocs-button
                      size="small"
                      variant="outline"
                      label={this.gettingLink ? 'Loading...' : 'Get Link'}
                      disabled={this.gettingLink}
                      onClick={() => this.getLink(this.recipient)}
                    />
                  )}
                </div>

                {this.link && (
                  <div class="link-wrapper">
                    <div class="link">{this.link}</div>
                    <verdocs-button size="small" variant="outline" label="Copy" onClick={() => this.copyLink(this.link)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div class="buttons">
            <verdocs-button size="small" label="Done" onClick={e => this.handleDone(e)} />
          </div>
        </div>
      </Host>
    );
  }
}
