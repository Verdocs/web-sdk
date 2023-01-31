import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Host, Prop, State} from '@stencil/core';
import {getEnvelopeById} from '../../../utils/Envelopes';
import EnvelopeStore from '../../../utils/envelopeStore';
import {SDKError} from '../../../utils/errors';
import {format} from 'date-fns';
import {IRecipient} from '@verdocs/js-sdk/Envelopes/Types';

const InformationCircle = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>`;

const Users = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>`;

const ClipboardDocuments = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>`;

interface IHistoryEntry {
  icon: string;
  message: string;
  date: Date;
}

/**
 * Displays a file upload mechanism suitable for the first step of creating a template.
 * This is typically the first step in a template creation workflow.
 */
@Component({
  tag: 'verdocs-envelope-sidebar',
  styleUrl: 'verdocs-envelope-sidebar.scss',
  shadow: false,
})
export class VerdocsEnvelopeSidebar {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The envelope ID to render. Set ONE OF templateId or envelopeId. If both are set, envelopeId will be ignored.
   */
  @Prop() envelopeId: string = '';

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() activeTab: number = 1;
  @State() panelOpen = false;

  componentWillLoad() {
    this.endpoint.loadSession();
  }

  // TODO: Handling signing vs preview-as-user cases
  // TODO: Handle anonymous case and failure to load due to not being logged in
  async componentDidLoad() {
    if (!this.envelopeId) {
      console.error(`[SIDEBAR] Missing required envelopeId`);
      return;
    }

    try {
      await getEnvelopeById(this.endpoint, this.envelopeId);
    } catch (e) {
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  setTab(tab: number) {
    this.panelOpen = tab !== this.activeTab || !this.panelOpen;
    this.activeTab = tab;
  }

  // TODO: Refactor to a common library?
  canResendRecipient(recipient: IRecipient) {
    return (
      !['pending', 'declined', 'submitted', 'canceled'].includes(recipient.status) && //
      !['complete', 'declined', 'canceled'].includes(EnvelopeStore.envelope.status)
    );
  }

  canModifyRecipient(recipient: IRecipient) {
    return (
      !recipient.claimed && //
      !['declined', 'signed', 'submitted', 'canceled'].includes(recipient.status) &&
      !['complete', 'declined', 'canceled'].includes(EnvelopeStore.envelope.status)
    );
  }

  handleRecipientAction(recipient: IRecipient, id: string) {
    console.log('recipient action', id, recipient);
    switch (id) {
      case 'reminder':
      case 'modify':
      case 'inperson':
      case 'details':
        break;
    }
  }

  prepareHistoryEntries() {
    const entries: IHistoryEntry[] = [];
    const histories = EnvelopeStore.envelope.histories || [];

    entries.push({icon: 'pencil', message: 'Envelope created.', date: new Date(EnvelopeStore.envelope.created_at)});

    if (EnvelopeStore.envelope.status === 'complete') {
      entries.push({icon: 'pencil', message: 'Envelope completed.', date: new Date(EnvelopeStore.envelope.updated_at)});
    }

    const ownerCanceled = histories.some(history => history.event === 'owner:canceled');
    if (EnvelopeStore.envelope.status === 'canceled' && !ownerCanceled) {
      entries.push({icon: 'pencil', message: 'Envelope Cancelled.', date: new Date(EnvelopeStore.envelope.canceled_at)});
    }

    histories.forEach(history => {
      const user = EnvelopeStore.envelope.recipients.find(recipient => recipient.role_name === history.role_name);
      const name = user?.full_name || '';

      switch (history.event.toLowerCase()) {
        case 'recipient:signed':
          entries.push({icon: 'gesture', message: `Signed by ${name}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:declined':
          entries.push({icon: 'clear', message: `Declined by ${name}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:opened':
          switch (history.event_detail) {
            // TODO: Sync these up with reality
            case 'email':
            case 'mail':
              entries.push({icon: 'visibility', message: `Opened by ${name}, through email.`, date: new Date(history.created_at)});
              break;
            case 'sms':
              entries.push({icon: 'visibility', message: `Opened by ${name}, through SMS.`, date: new Date(history.created_at)});
              break;
            case 'in_person_link':
              entries.push({icon: 'visibility', message: `Opened by ${name}, using In-person link.`, date: new Date(history.created_at)});
              break;
            case 'in_app':
              entries.push({icon: 'visibility', message: `Opened by ${name}, through dashboard.`, date: new Date(history.created_at)});
              break;
          }
          break;
        case 'recipient:submitted':
          switch (history.event_detail) {
            // TODO: Sync up
            case 'approver':
              entries.push({icon: 'check_circle', message: `Approved by ${name}.`, date: new Date(history.created_at)});
              break;
            default:
              entries.push({icon: 'send', message: `Submitted by ${name}.`, date: new Date(history.created_at)});
              break;
          }
          break;
        case 'recipient:prepared':
          entries.push({icon: 'send', message: `Prepared by ${name}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:claimed':
          if (history.event_detail === 'guest') {
            entries.push({icon: 'account_circle', message: `${name} claimed the Verdoc as a guest.`, date: new Date(history.created_at)});
          } else if (history.event_detail === 'profile') {
            entries.push({icon: 'verified_user', message: `${name} claimed the Verdoc as a verified user.`, date: new Date(history.created_at)});
          }
          break;
        case 'recipient:agreed':
          entries.push({icon: 'done', message: `${name} agreed to use electronic records and signatures.`, date: new Date(history.created_at)});
          break;
        case 'recipient:invited':
          if (history.event_detail === 'sms') {
            entries.push({icon: 'textsms', message: `${name} has been invited via SMS.`, date: new Date(history.created_at)});
          } else {
            entries.push({icon: 'mail', message: `${name} has been invited via email.`, date: new Date(history.created_at)});
          }
          break;
        case 'invitation:resent':
          entries.push({
            icon: 'mail',
            message: `Invitation was resent to ${name} ${history.event_detail === 'reminder' ? ' by reminder' : ''}.`,
            date: new Date(history.created_at),
          });
          break;
        case 'envelope:cc':
          entries.push({icon: 'contact_mail', message: `A copy has been sent to ${name}.`, date: new Date(history.created_at)});
          break;
        case 'recipient:delegated':
          entries.push({icon: 'people', message: history.event_detail, date: new Date(history.created_at)});
          break;
        case 'recipient:updated_info':
          entries.push({icon: 'perm_identity', message: history.event_detail, date: new Date(history.created_at)});
          break;
        case 'owner:updated_recipient_info':
          entries.push({icon: 'perm_identity', message: history.event_detail, date: new Date(history.created_at)});
          break;
        case 'created':
          entries.push({icon: 'create', message: `Envelope was created.`, date: new Date(history.created_at)});
          break;
        case 'completed':
          entries.push({icon: 'done_all', message: `Envelope was completed.`, date: new Date(history.created_at)});
          break;
        case 'canceled':
        case 'owner:canceled':
          entries.push({icon: 'cancel', message: `Envelope was canceled by the creator.`, date: new Date(history.created_at)});
          break;
        case 'owner:get_in_person_link':
          entries.push({icon: 'link', message: `Owner accessed the In-person link for ${user}.`, date: new Date(history.created_at)});
          break;
        default:
          break;
      }
    });

    return entries;
  }

  render() {
    if (!EnvelopeStore.envelope) {
      return <Host />;
    }

    const session = this.endpoint.getSession();
    const isEnvelopeOwner = session.profile_id === EnvelopeStore.envelope.profile_id; // TODO: What about org admins?
    const historyEntries = this.prepareHistoryEntries();

    return (
      <Host class={this.panelOpen ? 'open' : ''}>
        <div class="buttons">
          <button class={this.activeTab === 1 ? 'active' : ''} onClick={() => this.setTab(1)} innerHTML={InformationCircle} />
          <button class={this.activeTab === 2 ? 'active' : ''} onClick={() => this.setTab(2)} innerHTML={Users} />
          <button class={this.activeTab === 3 ? 'active' : ''} onClick={() => this.setTab(3)} innerHTML={ClipboardDocuments} />
        </div>

        {this.activeTab === 1 && (
          <div class="content">
            <div class="title">Details</div>

            <div class="label">Envelope ID</div>
            <div class="value">{EnvelopeStore.envelope.id}</div>

            <div class="label">Date Created</div>
            <div class="value">{format(new Date(EnvelopeStore.envelope.created_at), 'PP pp')}</div>

            <div class="label">Last Modified</div>
            <div class="value">{format(new Date(EnvelopeStore.envelope.updated_at), 'PP pp')}</div>

            <div class="label">Status</div>
            <div class="value">{EnvelopeStore.envelope.status}</div>

            <div class="label">Verdoc Owner UUID</div>
            <div class="value">{EnvelopeStore.envelope.profile_id}</div>

            <div class="label">Verdoc Owner Name</div>
            <div class="value">
              {EnvelopeStore.envelope.profile?.first_name} {EnvelopeStore.envelope.profile?.last_name}
            </div>

            <div class="label">Verdoc Owner Email</div>
            <div class="value">{EnvelopeStore.envelope.profile?.email}</div>
          </div>
        )}

        {this.activeTab === 2 && (
          <div class="content">
            <div class="title">Recipients</div>
            {EnvelopeStore.envelope.recipients.map((recipient, index) => (
              <div class="recipient-detail">
                <div class="recipient-header">
                  <div class="recipient-number">{index + 1}</div>
                  <div class="recipient-type">{recipient.type}</div>
                  <div class={{'recipient-status': true, [recipient.status]: true}}>{recipient.status}</div>
                  {isEnvelopeOwner && (
                    <verdocs-dropdown
                      onOptionSelected={item => this.handleRecipientAction(recipient, item.detail.id)}
                      options={[
                        {id: 'reminder', label: 'Send Reminder', disabled: !this.canResendRecipient(recipient)},
                        {id: 'modify', label: 'Modify Recipient', disabled: !this.canModifyRecipient(recipient)},
                        {id: 'inperson', label: 'Get In-Person Link', disabled: !this.canModifyRecipient(recipient) || !['invited', 'opened'].includes(recipient.status)},
                        // TODO: Details dialog
                        // {id:'details',label: 'View Details'},
                      ]}
                    />
                  )}
                </div>

                <dic class="recipient-content">
                  <div class="recipient-name">{recipient.full_name}</div>
                  <div class="recipient-name">{recipient.email}</div>
                  <div class="recipient-name">{recipient.phone}</div>
                </dic>
              </div>
            ))}
          </div>
        )}

        {this.activeTab === 3 && (
          <div class="content">
            <div class="title">History</div>

            {historyEntries.map(entry => (
              <div class="history-entry">
                <div class="activity-icon">{entry.icon}</div>
                <div class="">
                  <div class="activity-text">{entry.message}</div>
                  {/* 'MMMM Do YYYY, h:mm:ss a'  */}
                  <div class="activity-date">{format(entry.date, 'PP pp')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Host>
    );
  }
}
