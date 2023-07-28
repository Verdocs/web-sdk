import {format} from 'date-fns';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {cancelEnvelope} from '@verdocs/js-sdk/Envelopes/Envelopes';
import {resendInvitation} from '@verdocs/js-sdk/Envelopes/Recipients';
import {IEnvelope, IRecipient} from '@verdocs/js-sdk/Envelopes/Types';
import {userIsEnvelopeOwner} from '@verdocs/js-sdk/Envelopes/Permissions';
import {Component, h, Event, EventEmitter, Host, Prop, State} from '@stencil/core';
import {getEnvelopeStore, TEnvelopeStore} from '../../../utils/EnvelopeStore';
import {FORMAT_TIMESTAMP} from '../../../utils/Types';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

const InformationCircle = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>`;

const Users = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>`;

const ClipboardDocuments = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>`;

// https://materialui.co/icon/verified-user and https://heroicons.com/
const ActivityIcons = {
  visibility: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" /></svg>`,
  pencil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" /></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
  done: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" /></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
  gesture: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z"/></svg>`,
  clear: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  check_circle: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
  link: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
  cancel: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`,
  done_all: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/></svg>`,
  create: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
  perm_identity: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
  people: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
  contact_email: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M21 8V7l-3 2-3-2v1l3 2 3-2zm1-5H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm8-6h-8V6h8v6z"/></svg>`,
  textsms: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>`,
  verified_user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff"><path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>`,
  account_circle: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`,
};

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

  /**
   * Event fired when the envelope is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) envelopeUpdated: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope; event: string}>;

  /**
   * Event fired when the sidebar is opened or closed.
   */
  @Event({composed: true}) toggle: EventEmitter<{open: boolean}>;

  /**
   * Event fired when the user clicks Send Another in the Manage Recipients dialog. It is up to the host application
   * to redirect the user to the appropriate next workflow step.
   */
  @Event({composed: true}) another: EventEmitter<{envelope: IEnvelope}>;

  // @State() envelope: IEnvelope | null = null;
  // @State() sortedRecipients: IRecipient[] = [];
  // @State() roleNames: string[] = [];
  @State() activeTab: number = 1;
  @State() panelOpen = false;
  @State() showManageDialog = false;
  @State() showRecipientDialog = '';
  @State() showCancelDialog = false;
  @State() loading = true;

  store: TEnvelopeStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.envelopeId) {
        console.log(`[SIDEBAR] Missing required envelope ID ${this.envelopeId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[SIDEBAR] Unable to start session, must be authenticated');
        return;
      }

      this.store = await getEnvelopeStore(this.endpoint, this.envelopeId, true);
      this.sortEnvelopeRecipients();
      this.loading = false;
    } catch (e) {
      console.log('[SIDEBAR] Error loading envelope', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  sortEnvelopeRecipients() {
    this.store?.state?.recipients.sort((a, b) => {
      return a.sequence === b.sequence ? a.order - b.order : a.sequence - b.sequence;
    });
  }

  setTab(tab: number) {
    this.panelOpen = tab !== this.activeTab || !this.panelOpen;
    this.toggle?.emit({open: this.panelOpen});
    this.activeTab = tab;
  }

  // TODO: Refactor to a common library?
  canResendRecipient(recipient: IRecipient) {
    return (
      !['pending', 'declined', 'submitted', 'canceled'].includes(recipient.status) && //
      !['complete', 'declined', 'canceled'].includes(this.store?.state?.status)
    );
  }

  handleRecipientAction(recipient: IRecipient, id: string) {
    console.log('[SIDEBAR] Recipient action', id, recipient);
    switch (id) {
      case 'reminder':
        resendInvitation(this.endpoint, this.envelopeId, recipient.role_name)
          .then(() => {
            VerdocsToast('Reminder Sent', {style: 'success'});
          })
          .catch(e => {
            console.log('[SIDEBAR] Error resending invitation', e);
            VerdocsToast('Error resending invitation: ' + e.message, {style: 'error'});
          });
        break;

      case 'inperson':
        this.showRecipientDialog = recipient.role_name;
        break;

      case 'modify':
        VerdocsToast('This feature will be enabled in a future release. Please try again later.', {style: 'info'});
        break;

      case 'details':
        VerdocsToast('This feature will be enabled in a future release. Please try again later.', {style: 'info'});
        break;
    }

    this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.store?.state, event: id});
  }

  cancelEnvelope() {
    cancelEnvelope(this.endpoint, this.envelopeId)
      .then(async r => {
        console.log('[SIDEBAR] Envelope canceled', r);
        VerdocsToast('Envelope canceled', {style: 'success'});

        this.store = await getEnvelopeStore(this.endpoint, this.envelopeId, true);
        this.sortEnvelopeRecipients();
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.store?.state, event: 'canceled'});
      })
      .catch(e => {
        console.log('[SIDEBAR] Error canceling envelope', e);
        VerdocsToast('Error canceling envelope: ' + e.message, {style: 'error'});
      });
  }

  prepareHistoryEntries() {
    const entries: IHistoryEntry[] = [];
    const histories = this.store?.state?.histories || [];

    entries.push({icon: 'pencil', message: 'Envelope created.', date: new Date(this.store?.state?.created_at)});

    if (this.store?.state?.status === 'complete') {
      entries.push({icon: 'pencil', message: 'Envelope completed.', date: new Date(this.store?.state?.updated_at)});
    }

    const ownerCanceled = histories.some(history => history.event === 'owner:canceled');
    if (this.store?.state?.status === 'canceled' && !ownerCanceled) {
      entries.push({icon: 'pencil', message: 'Envelope Cancelled.', date: new Date(this.store?.state?.canceled_at)});
    }

    histories.forEach(history => {
      const user = this.store.state?.recipients.find(recipient => recipient.role_name === history.role_name);
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
              entries.push({icon: 'visibility', message: `Opened by ${name}, via email.`, date: new Date(history.created_at)});
              break;
            case 'sms':
              entries.push({icon: 'visibility', message: `Opened by ${name}, via SMS.`, date: new Date(history.created_at)});
              break;
            case 'in_person_link':
              entries.push({icon: 'visibility', message: `Opened by ${name}, via In-person link.`, date: new Date(history.created_at)});
              break;
            case 'in_app':
              entries.push({icon: 'visibility', message: `Opened by ${name}, via dashboard.`, date: new Date(history.created_at)});
              break;
            default:
              entries.push({icon: 'visibility', message: `Opened by ${name}.`, date: new Date(history.created_at)});
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
          console.log('[SIDEBAR] Unknown history type', history);
          break;
      }
    });

    entries.sort((a, b) => b.date.getTime() - a.date.getTime());
    return entries;
  }

  // canModify(recipient: IRecipient) {
  //   const invalidRecipientStatus = ['declined', 'signed', 'submitted', 'canceled'];
  //   const invalidEnvelopeStatus = ['complete', 'declined', 'canceled'];
  //   return recipient.claimed !== true && invalidRecipientStatus.indexOf(recipient.status) === -1 && invalidEnvelopeStatus.indexOf(this.store?.state?.status) === -1;
  // }

  render() {
    if (!this.store.state) {
      return <Host />;
    }

    const session = this.endpoint.getSession();
    const isEnvelopeOwner = userIsEnvelopeOwner(session, this.store.state);
    const historyEntries = this.prepareHistoryEntries();
    const functionsDisabled = this.store?.state?.status !== 'pending' && this.store?.state?.status !== 'in progress';

    return (
      <Host class={this.panelOpen ? 'open' : ''}>
        <div class="side-buttons">
          <button class={this.activeTab === 1 ? 'active' : ''} onClick={() => this.setTab(1)} innerHTML={InformationCircle} />
          <button class={this.activeTab === 2 ? 'active' : ''} onClick={() => this.setTab(2)} innerHTML={Users} />
          <button class={this.activeTab === 3 ? 'active' : ''} onClick={() => this.setTab(3)} innerHTML={ClipboardDocuments} />
        </div>

        {this.activeTab === 1 && (
          <div class="content">
            <div class="title">Details</div>

            <div class="label">Envelope ID</div>
            <div class="value">{this.store?.state?.id}</div>

            <div class="label">Date Created</div>
            <div class="value">{format(new Date(this.store?.state?.created_at), FORMAT_TIMESTAMP)}</div>

            <div class="label">Last Modified</div>
            <div class="value">{format(new Date(this.store?.state?.updated_at), FORMAT_TIMESTAMP)}</div>

            <div class="label">Status</div>
            <div class="value">{this.store?.state?.status}</div>

            <div class="label">Verdoc Owner ID</div>
            <div class="value">{this.store?.state?.profile_id}</div>

            <div class="label">Verdoc Owner Name</div>
            <div class="value">
              {this.store?.state?.profile?.first_name} {this.store?.state?.profile?.last_name}
            </div>

            <div class="label">Verdoc Owner Email</div>
            <div class="value">{this.store?.state?.profile?.email}</div>
          </div>
        )}

        {this.activeTab === 2 && (
          <div class="content">
            <div class="title">Recipients</div>
            {this.store?.state?.recipients.map((recipient, index) => {
              const canGetInPersonLink = recipient.status !== 'submitted' && recipient.status !== 'canceled' && recipient.status !== 'declined';
              const canSendReminder = this.canResendRecipient(recipient);
              return (
                <div class="recipient-detail">
                  <div class="recipient-header">
                    <div class="recipient-number">{index + 1}</div>
                    <div class="recipient-type">{recipient.role_name}</div>
                    <div class={{'recipient-status': true, [recipient.status]: true}}>{recipient.status}</div>
                    {isEnvelopeOwner && !functionsDisabled && (
                      <verdocs-dropdown
                        onOptionSelected={item => this.handleRecipientAction(recipient, item.detail.id)}
                        options={[
                          {id: 'reminder', label: 'Send Reminder', disabled: !canSendReminder},
                          {id: 'inperson', label: 'Get In-Person Link', disabled: !canGetInPersonLink},
                          // {id: 'modify', label: 'Modify Recipient', disabled: !this.canModifyRecipient(recipient)},
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
              );
            })}

            {isEnvelopeOwner && (
              <verdocs-button
                class="manage-recipients-button"
                variant="standard"
                label="Turn On Reminders"
                onClick={() => (this.showManageDialog = !functionsDisabled)}
                disabled={functionsDisabled}
              />
            )}
            {isEnvelopeOwner && (
              <verdocs-button
                class="manage-recipients-button"
                variant="standard"
                label="Cancel Verdoc"
                onClick={() => (this.showCancelDialog = !functionsDisabled)}
                disabled={functionsDisabled}
              />
            )}
          </div>
        )}

        {this.activeTab === 3 && (
          <div class="content">
            <div class="title">History</div>

            {historyEntries.map(entry => (
              <div class="history-entry">
                <div class="activity-icon" innerHTML={ActivityIcons[entry.icon] || entry.icon} />
                <div class="activity-details">
                  <div class="activity-text">{entry.message}</div>
                  {/* 'MMMM Do YYYY, h:mm:ss a'  */}
                  <div class="activity-date">{format(entry.date, FORMAT_TIMESTAMP)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {this.showRecipientDialog && (
          <verdocs-envelope-recipient-link envelopeId={this.envelopeId} roleName={this.showRecipientDialog} onNext={() => (this.showRecipientDialog = '')} />
        )}

        {this.showManageDialog && (
          <verdocs-envelope-recipient-summary
            envelopeId={this.envelopeId}
            canView={false}
            onAnother={() => {
              this.showManageDialog = false;
              this.another?.emit({envelope: this.store.state});
            }}
            onNext={() => (this.showManageDialog = false)}
          />
        )}

        {this.showCancelDialog && (
          <verdocs-ok-dialog
            heading="Cancel Envelope?"
            message={'Are you sure you want to cancel this Envelope? This action cannot be undone.'}
            onNext={() => {
              this.showCancelDialog = false;
              this.cancelEnvelope();
            }}
          />
        )}
      </Host>
    );
  }
}
