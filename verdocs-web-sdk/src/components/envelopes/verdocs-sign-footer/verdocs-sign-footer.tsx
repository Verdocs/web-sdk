import {IEnvelope} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Host, Prop, State} from '@stencil/core';
import {getEnvelope, VerdocsEndpoint} from '@verdocs/js-sdk';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const QuestionIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.4809 13.8423H15.4C16.2962 13.8423 17 13.1288 17 12.2764V5.56582C17 4.71348 16.2962 4 15.4 4H4.6C3.70383 4 3 4.71348 3 5.56582V12.2764C3 13.1288 3.70383 13.8423 4.6 13.8423H6.19908L6.2 17L6.20346 16.9997L6.20502 16.9988L10.4809 13.8423ZM6.79895 17.8034C6.35668 18.1298 5.73 18.0406 5.39921 17.6042C5.26989 17.4335 5.2 17.2262 5.2 17.0133L5.19937 14.8423H4.6C3.16406 14.8423 2 13.6935 2 12.2764V5.56582C2 4.14876 3.16406 3 4.6 3H15.4C16.8359 3 18 4.14876 18 5.56582V12.2764C18 13.6935 16.8359 14.8423 15.4 14.8423H10.81L6.79895 17.8034Z" fill="#424242"/></svg>`;
const DeclineIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.14645 7.14645C7.34171 6.95118 7.65829 6.95118 7.85355 7.14645L10 9.29289L12.1464 7.14645C12.3417 6.95118 12.6583 6.95118 12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L10.7071 10L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L10 10.7071L7.85355 12.8536C7.65829 13.0488 7.34171 13.0488 7.14645 12.8536C6.95118 12.6583 6.95118 12.3417 7.14645 12.1464L9.29289 10L7.14645 7.85355C6.95118 7.65829 6.95118 7.34171 7.14645 7.14645ZM3 6C3 4.34315 4.34315 3 6 3H14C15.6569 3 17 4.34315 17 6V14C17 15.6569 15.6569 17 14 17H6C4.34315 17 3 15.6569 3 14V6ZM6 4C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16H14C15.1046 16 16 15.1046 16 14V6C16 4.89543 15.1046 4 14 4H6Z" fill="#424242"/></svg>`;
const SaveIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 5C3 3.89543 3.89543 3 5 3H13.3787C13.9091 3 14.4178 3.21071 14.7929 3.58579L16.4142 5.20711C16.7893 5.58218 17 6.09089 17 6.62132V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V5ZM5 4C4.44772 4 4 4.44772 4 5V15C4 15.5523 4.44772 16 5 16L5 11.5C5 10.6716 5.67157 10 6.5 10H13.5C14.3284 10 15 10.6716 15 11.5V16C15.5523 16 16 15.5523 16 15V6.62132C16 6.3561 15.8946 6.10175 15.7071 5.91421L14.0858 4.29289C13.8983 4.10536 13.6439 4 13.3787 4L13 4V6.5C13 7.32843 12.3284 8 11.5 8L7.5 8C6.67157 8 6 7.32843 6 6.5L6 4H5ZM7 4L7 6.5C7 6.77614 7.22386 7 7.5 7L11.5 7C11.7761 7 12 6.77614 12 6.5V4L7 4ZM14 16V11.5C14 11.2239 13.7761 11 13.5 11H6.5C6.22386 11 6 11.2239 6 11.5V16H14Z" fill="#424242"/></svg>`;

/**
 * Typically presented by the `verdocs-sign` component. Displays a footer toolbar
 * with a few convenience functions for the envelope recipient to use.
 */
@Component({
  tag: 'verdocs-sign-footer',
  styleUrl: 'verdocs-sign-footer.scss',
  shadow: false,
})
export class VerdocsSignFooter {
  private envelopeListenerId = null;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The envelope ID to render. Set ONE OF templateId or envelopeId. If both are set, envelopeId will be ignored.
   */
  @Prop() envelopeId: string = '';

  /**
   * If the recipient is "done," some buttons will be hidden.
   */
  @Prop() isDone = false;

  /**
   * Event fired if the user asks the sender a question. The parent component is responsible for handling this.
   */
  @Event({composed: true}) askQuestion: EventEmitter<{question: string}>;

  /**
   * Event fired if the user asks the sender a question. The parent component is responsible for handling this.
   */
  @Event({composed: true}) decline: EventEmitter;

  /**
   * Event fired if the user asks the sender a question. The parent component is responsible for handling this.
   */
  @Event({composed: true}) finishLater: EventEmitter;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the envelope is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  // @Event({composed: true}) envelopeUpdated: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope; event: string}>;

  @State() askingQuestion = false;
  @State() declinine = false;
  @State() envelope: IEnvelope | null = null;

  async componentWillLoad() {
    try {
      // NOTE: The caller must have a signing session already active and shared to us via
      // the endpoint property.
      if (!this.envelopeId) {
        console.log(`[FOOTER] Missing required envelope ID ${this.envelopeId}`);
        return;
      }

      this.listenToEnvelope();
    } catch (e) {
      console.log('[FOOTER] Error loading envelope', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  disconnectedCallback() {
    this.unlistenToEnvelope();
  }

  async listenToEnvelope() {
    console.log('[FOOTER] Loading envelope', this.envelopeId);
    this.unlistenToEnvelope();
    Store.subscribe(
      'envelopes',
      this.envelopeId,
      () => getEnvelope(this.endpoint, this.envelopeId),
      false,
      (envelope: IEnvelope) => {
        this.envelope = envelope;
      },
    );
  }

  unlistenToEnvelope() {
    if (this.envelopeListenerId) {
      Store.store.delListener(this.envelopeListenerId);
      this.envelopeListenerId = null;
    }
  }

  // handleRecipientAction(recipient: IRecipient, id: string) {
  //   console.log('[SIDEBAR] Recipient action', id, recipient);
  //   switch (id) {
  //     case 'update':
  //       this.showUpdateDialog = recipient.role_name;
  //       break;
  //
  //     case 'reminder':
  //       remindRecipient(this.endpoint, this.envelopeId, recipient.role_name)
  //         .then(() => {
  //           VerdocsToast('Reminder Sent', {style: 'success'});
  //         })
  //         .catch(e => {
  //           console.log('[SIDEBAR] Error resending invitation', e);
  //           VerdocsToast('Error resending invitation: ' + e.message, {style: 'error'});
  //         });
  //       break;
  //
  //     case 'reinvite':
  //       this.showReinviteDialog = recipient.role_name;
  //       break;
  //
  //     case 'inperson':
  //       this.showRecipientDialog = recipient.role_name;
  //       break;
  //
  //     case 'modify':
  //       VerdocsToast('This feature will be enabled in a future release. Please try again later.', {style: 'info'});
  //       break;
  //
  //     case 'details':
  //       VerdocsToast('This feature will be enabled in a future release. Please try again later.', {style: 'info'});
  //       break;
  //   }
  // }

  // handleUpdateRecipient(originalRecipient: IRecipient, updatedRecipient: IRecipient) {
  //   console.log('Updating recipient', originalRecipient, updatedRecipient);
  //   const fields: any = {};
  //   if (updatedRecipient.email !== originalRecipient.email) {
  //     fields.email = updatedRecipient.email;
  //   }
  //   if (updatedRecipient.phone !== originalRecipient.phone) {
  //     fields.phone = updatedRecipient.phone;
  //   }
  //   if (updatedRecipient.message !== originalRecipient.message) {
  //     fields.message = updatedRecipient.message;
  //   }
  //   if (updatedRecipient.first_name !== originalRecipient.first_name) {
  //     fields.first_name = updatedRecipient.first_name;
  //   }
  //   if (updatedRecipient.last_name !== originalRecipient.last_name) {
  //     fields.last_name = updatedRecipient.last_name;
  //   }
  //
  //   if (Object.keys(fields).length > 0) {
  //     updateRecipient(this.endpoint, this.envelopeId, originalRecipient.role_name, fields)
  //       .then(r => {
  //         // TODO: Reload the envelope?
  //         VerdocsToast('Recipient updated', {style: 'success'});
  //         console.log('[SIDEBAR] Updated recipient', r);
  //         Store.getEnvelope(this.endpoint, this.envelopeId, true);
  //         this.showUpdateDialog = '';
  //       })
  //       .catch(e => {
  //         VerdocsToast(e.response.data.error, {style: 'error'});
  //         this.showUpdateDialog = '';
  //       });
  //   } else {
  //     this.showUpdateDialog = '';
  //   }
  // }

  render() {
    const hasPoweredBy = !!this.envelope?.organization?.powered_by_label;
    const hasLinks = !!this.envelope?.organization?.terms_use_url || !!this.envelope?.organization?.privacy_policy_url;
    const hasButtons = !this.isDone;

    return (
      <Host class={{'has-buttons': hasButtons, 'no-buttons': !hasButtons, 'has-powered-by': hasPoweredBy, 'has-links': hasLinks, 'just-buttons': !hasPoweredBy && !hasLinks}}>
        {this.envelope?.organization?.powered_by_label && (
          <div class="powered-by">
            {this.envelope?.organization?.powered_by_label ? (
              <a href={this.envelope?.organization?.powered_by_url} target="_blank" rel="noopener noreferrer">
                <span>{this.envelope?.organization?.powered_by_label}</span>
              </a>
            ) : (
              <span>{this.envelope?.organization?.powered_by_label}</span>
            )}
          </div>
        )}

        {!this.isDone && (
          <div class="buttons">
            <button onClick={() => (this.askingQuestion = true)}>
              <span innerHTML={QuestionIcon} />
              Ask Sender a Question
            </button>
            <button onClick={() => this.decline?.emit()}>
              <span innerHTML={DeclineIcon} />
              Decline Signing
            </button>
            <button onClick={() => this.finishLater?.emit()}>
              <span innerHTML={SaveIcon} />
              Finish Later
            </button>
          </div>
        )}

        <div class="links">
          {this.envelope?.organization?.terms_use_url && (
            <a href={this.envelope?.organization?.terms_use_url} target="_blank" rel="noopener noreferrer">
              <span>Terms of Use</span>
            </a>
          )}
          {this.envelope?.organization?.privacy_policy_url && (
            <a href={this.envelope?.organization?.privacy_policy_url} target="_blank" rel="noopener noreferrer">
              <span>Privacy Policy</span>
            </a>
          )}
        </div>

        {this.askingQuestion && (
          <verdocs-question-dialog
            onNext={e => {
              this.askQuestion?.emit({question: e.detail.question});
              this.askingQuestion = false;
            }}
            onExit={() => (this.askingQuestion = false)}
          />
        )}
      </Host>
    );
  }
}
