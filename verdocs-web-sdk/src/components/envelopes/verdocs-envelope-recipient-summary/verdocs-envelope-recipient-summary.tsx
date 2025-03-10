import {formatFullName, getEnvelope, getInPersonLink, getRecipientsWithActions, IEnvelope, IRecipient, recipientCanAct, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, Host, h, State, Event, EventEmitter} from '@stencil/core';
// import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

/**
 * Displays a list of recipients with options to get in-person signing links for each one.
 */
@Component({
  tag: 'verdocs-envelope-recipient-summary',
  styleUrl: 'verdocs-envelope-recipient-summary.scss',
})
export class VerdocsEnvelopeRecipientSummary {
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
   * Enable or disable the Send Another button.
   */
  @Prop() canSendAnother = true;

  /**
   * Enable or disable the View button.
   */
  @Prop() canView = true;

  /**
   * Enable or disable the Done button.
   */
  @Prop() canDone = true;

  /**
   * Event fired when the user clicks Send Another to proceed. It is up to the host application
   * to redirect the user to the appropriate next workflow step.
   */
  @Event({composed: true}) another: EventEmitter<{envelope: IEnvelope}>;

  /**
   * Event fired when the user clicks Send Another to proceed. It is up to the host application
   * to redirect the user to the appropriate next workflow step.
   */
  @Event({composed: true}) view: EventEmitter<{envelope: IEnvelope}>;

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
  @State() recipientStatusIcons = [];
  @State() containerId = `verdocs-status-indicator-${Math.random().toString(36).substring(2, 11)}`;
  @State() gettingLinks: Record<string, boolean> = {};
  @State() links: Record<string, string> = {};

  @State() loading = true;
  @State() envelope: IEnvelope | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.envelopeId) {
        console.log(`[RECIPIENTS] Missing required envelope ID ${this.envelopeId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[RECIPIENTS] Unable to start session, must be authenticated');
        return;
      }

      this.listenToEnvelope();
    } catch (e) {
      console.log('[RECIPIENTS] Error loading envelope', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  disconnectedCallback() {
    this.unlistenToEnvelope();
  }

  async listenToEnvelope() {
    console.log('[SIDEBAR] Loading envelope', this.envelopeId);
    this.unlistenToEnvelope();
    Store.subscribe(
      'envelopes',
      this.envelopeId,
      () => getEnvelope(this.endpoint, this.envelopeId),
      false,
      (envelope: IEnvelope) => {
        this.envelope = envelope;
        this.loading = false;

        this.sortEnvelopeRecipients();
      },
    );
  }

  unlistenToEnvelope() {
    if (this.envelopeListenerId) {
      Store.store.delListener(this.envelopeListenerId);
      this.envelopeListenerId = null;
    }
  }

  sortEnvelopeRecipients() {
    (this.envelope?.recipients || []).sort((a, b) => {
      return a.sequence === b.sequence ? a.order - b.order : a.sequence - b.sequence;
    });
  }

  handleAnother(e: any) {
    e.preventDefault();
    this.another?.emit({envelope: this.envelope});
  }

  handleView(e: any) {
    e.preventDefault();
    this.view?.emit({envelope: this.envelope});
  }

  handleDone(e: any) {
    e.preventDefault();
    this.next?.emit({envelope: this.envelope});
  }

  copyLink(link: string) {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // VerdocsToast('Link copied to clipboard!', {style: 'success', duration: 3000});
      })
      .catch(e => {
        console.warn('[RECIPIENTS] Error copying to clipboard', e);
        this.sdkError?.emit(e);
        // VerdocsToast(`Unable to copy to clipboard: ${e.message}`, {style: 'error'});
      });
  }
  xw;
  getLink(recipient: IRecipient) {
    this.gettingLinks = {...this.gettingLinks, [recipient.role_name]: true};
    getInPersonLink(this.endpoint, recipient.envelope_id, recipient.role_name)
      .then(response => {
        this.gettingLinks = {...this.gettingLinks, [recipient.role_name]: false};
        this.links = {...this.links, [recipient.role_name]: response.link};
        this.copyLink(response.link);
      })
      .catch(e => {
        this.gettingLinks = {...this.gettingLinks, [recipient.role_name]: false};
        console.log('[RECIPIENTS] Error getting link', e);
        this.sdkError?.emit(e);
        // VerdocsToast('Unable to get link: ' + e.message, {style: 'error'});
      });
  }

  render() {
    if (this.loading) {
      return <Host />;
    }

    return (
      <Host>
        <div class="summary-content">
          <h1 class="summary-title">Recipient Summary</h1>
          <div class="summary-rows">
            {(this.envelope?.recipients || []).map(recipient => {
              const recipientsWithActions = getRecipientsWithActions(this.envelope);
              const showLinkButton = recipientCanAct(recipient, recipientsWithActions);
              const link = this.links[recipient.role_name];
              const gettingLink = this.gettingLinks[recipient.role_name];
              const fullName = formatFullName(recipient);

              return (
                <div class="summary-recipient">
                  <div class="role-name">{recipient.role_name}</div>
                  <div class="role-details">
                    <div class="role-info">
                      <div class="role-full-name">
                        {fullName} ({recipient.email || recipient.phone})
                      </div>
                      {showLinkButton && !link && <verdocs-button size="small" variant="outline" label="Get Link" disabled={gettingLink} onClick={() => this.getLink(recipient)} />}
                    </div>

                    {link && (
                      <div class="link-wrapper">
                        <div class="link">{link}</div>
                        <verdocs-button size="small" variant="outline" label="Copy" onClick={() => this.copyLink(link)} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {(this.canSendAnother || this.canView || this.canDone) && (
            <div class="buttons">
              {this.canSendAnother && <verdocs-button size="small" label="Send Another" onClick={e => this.handleAnother(e)} />}
              {this.canView && <verdocs-button size="small" label="View Now" onClick={e => this.handleView(e)} />}
              {this.canDone && <verdocs-button size="small" label="Done" onClick={e => this.handleDone(e)} />}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
