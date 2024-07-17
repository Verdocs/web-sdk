import {
  IOrganizationInvitation,
  VerdocsEndpoint,
  getOrganizationInvitations,
  getOrganizationMembers,
  IProfile,
  deleteOrganizationMember,
  createOrganizationInvitation,
  deleteOrganizationInvitation,
  resendOrganizationInvitation,
  formatFullName,
  formatInitials,
  capitalize,
  TRole,
} from '@verdocs/js-sdk';
import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {format} from 'date-fns';

const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;
const ArrowPathIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>`;

// const getRoleLabel = (roles: any[]) => {
//   if (roles.find(role => role.name === 'owner') !== undefined) return 'Owner';
//   if (roles.find(role => role.name === 'admin') !== undefined) return 'Admin';
//   if (roles.find(role => role.name === 'member') !== undefined) return 'Member';
//   if (roles.find(role => role.name === 'basic_user') !== undefined) return 'Basic User';
//   if (roles.find(role => role.name === 'contact') !== undefined) return 'Contact';
// };
//
const getRoleColor = (roles: any[]) => {
  if (roles.find(role => role.name === 'owner') !== undefined) return '#9333ea';
  if (roles.find(role => role.name === 'admin') !== undefined) return '#2563eb';
  if (roles.find(role => role.name === 'member') !== undefined) return '#16a34a';
  if (roles.find(role => role.name === 'basic_user') !== undefined) return '#ea580c';
  if (roles.find(role => role.name === 'contact') !== undefined) return '#52525B';
};

const roleOptions = [
  {label: 'Contact', value: 'contact'},
  {label: 'Basic User', value: 'basic_user'},
  {label: 'Member', value: 'member'},
  {label: 'Admin', value: 'admin'},
  {label: 'Owner', value: 'owner'},
];

/**
 * Displays a settings form that allows the user to manage their Verdocs profile.
 */
@Component({
  tag: 'verdocs-settings-members',
  styleUrl: 'verdocs-settings-members.scss',
})
export class VerdocsSettingsMembers {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the user chooses to invite a new member.
   */
  @Event({composed: true}) memberInvited: EventEmitter<{endpoint: VerdocsEndpoint; member: IProfile}>;

  /**
   * Event fired when the user chooses to invite a new member.
   */
  @Event({composed: true}) memberUpdated: EventEmitter<{endpoint: VerdocsEndpoint; member: IProfile}>;

  /**
   * Event fired when the user chooses to invite a new member.
   */
  @Event({composed: true}) memberRemoved: EventEmitter<{endpoint: VerdocsEndpoint; member: IProfile}>;

  @State() members: IProfile[] = [];
  @State() invited: IOrganizationInvitation[] = [];
  // @State() roles: TRole[] = [];
  @State() selectedTab = 0;
  @State() invitingMember = false;
  @State() newEmailAddress = '';
  @State() newFirst = '';
  @State() newLast = '';
  @State() newRole: TRole = 'member';
  @State() submitting = false;
  @State() deletingInvitation: IOrganizationInvitation | null = null;
  @State() resendingInvitation: IOrganizationInvitation | null = null;
  @State() deletingMember: IProfile | null = null;

  componentWillLoad() {
    this.endpoint.loadSession();
    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return;
    }
  }

  async componentDidLoad() {
    this.loadMembers().catch((e: any) => console.log('Unknown Error', e));
  }

  async loadMembers() {
    try {
      const [members, invites] = await Promise.all([getOrganizationMembers(this.endpoint), getOrganizationInvitations(this.endpoint)]);
      this.members = members;
      this.invited = invites;
      this.newRole = 'member';
    } catch (e) {
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      VerdocsToast('Unable to load members. Please try again later');
    }
  }

  async handleInviteMember() {
    this.submitting = true;
    createOrganizationInvitation(VerdocsEndpoint.getDefault(), {
      email: this.newEmailAddress,
      first_name: this.newFirst,
      last_name: this.newLast,
      role: this.newRole,
    })
      .then(r => {
        console.log('[SETTINGS] Invited member', r);
        this.invitingMember = false;
        this.submitting = false;
        this.newRole = 'member';
        this.newEmailAddress = '';
        this.newFirst = '';
        this.newLast = '';
        VerdocsToast('Invitation sent!', {style: 'success'});
        this.loadMembers();
      })
      .catch(e => {
        console.log('[SETTINGS] Unable to invite member', e);
        this.invitingMember = false;
        this.submitting = false;
        this.newRole = 'member';
        this.newEmailAddress = '';
        this.newFirst = '';
        this.newLast = '';
        VerdocsToast('Unable to invite member. Please try again later', {style: 'error'});
      });
  }

  async handleDeleteMember() {
    this.submitting = true;
    deleteOrganizationMember(VerdocsEndpoint.getDefault(), this.deletingMember.email)
      .then(() => {
        this.submitting = false;
        this.deletingMember = null;
        VerdocsToast('The member has been deleted.', {style: 'success'});
        this.loadMembers();
      })
      .catch(e => {
        this.submitting = false;
        this.deletingMember = null;
        console.log('Delete error', e);
        VerdocsToast('Unable to cancel invitation. Please try again later', {style: 'error'});
      });
  }

  async handleDeleteInvitation() {
    this.submitting = true;
    deleteOrganizationInvitation(VerdocsEndpoint.getDefault(), this.deletingInvitation.email)
      .then(() => {
        this.submitting = false;
        this.deletingInvitation = null;
        VerdocsToast('The invitation has been cancelled.', {style: 'success'});
        this.loadMembers();
      })
      .catch(e => {
        this.submitting = false;
        this.deletingInvitation = null;
        console.log('Delete error', e);
        VerdocsToast('Unable to cancel invitation. Please try again later', {style: 'error'});
      });
  }

  async handleResendInvitation() {
    this.submitting = true;
    resendOrganizationInvitation(VerdocsEndpoint.getDefault(), this.resendingInvitation.email)
      .then(() => {
        this.submitting = false;
        this.resendingInvitation = null;
        VerdocsToast('The invitation has been resent.', {style: 'success'});
        this.loadMembers();
      })
      .catch(e => {
        this.submitting = false;
        this.resendingInvitation = null;
        console.log('REsend error', e);
        VerdocsToast('Unable to resend invitation. Please try again later', {style: 'error'});
      });
  }

  render() {
    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return <Host class="authentication-required">Must be authenticated</Host>;
    }

    return (
      <Host>
        <verdocs-tabs
          tabs={[{label: `Members (${this.members.length})`}, {label: `Pending Invitations (${this.invited.length})`}]}
          onSelectTab={e => (this.selectedTab = e.detail.index)}
        />

        {this.selectedTab === 0 && (
          <verdocs-table
            data={this.members}
            columns={[
              {
                id: 'name',
                renderHeader: () => 'Member',
                renderCell: (_, row) => (
                  <div style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center'}}>
                    <div class="role" style={{backgroundColor: getRoleColor(row.roles)}}>
                      {formatInitials(row)}
                    </div>
                    <span>{formatFullName(row)}</span>
                  </div>
                ),
              },
              {id: 'email', header: 'E-mail Address'},
              {id: 'phone', header: 'Phone Number'},
              {id: 'roles', header: 'Role', renderCell: (_, row) => `${row.roles}`},
              {
                id: 'actions',
                header: 'Actions',
                renderCell: (_, row) => <div>{row.id !== this.endpoint.session.profile_id && <div innerHTML={TrashIcon} onClick={() => (this.deletingMember = row)} />}</div>,
              },
            ]}
          />
        )}

        {this.selectedTab === 1 && (
          <verdocs-table
            data={this.invited}
            columns={[
              {id: 'email', header: 'E-mail Address'},
              {id: 'generated_at', header: 'Invited', renderCell: (_, row) => <div>{format(new Date(row.generated_at), 'MMM d, Y')}</div>},
              {id: 'role', header: 'Role', renderCell: (_, row) => <div>{row.role}</div>},
              {id: 'status', header: 'Status', renderCell: (_, row) => <div>{capitalize(row.status)}</div>},
              {
                id: 'actions',
                header: 'Actions',
                renderCell: (_, row) => (
                  <div>
                    <div innerHTML={TrashIcon} onClick={() => (this.deletingInvitation = row)} />
                    <div innerHTML={ArrowPathIcon} onClick={() => (this.resendingInvitation = row)} />
                  </div>
                ),
              },
            ]}
          />
        )}

        <verdocs-button label="Invite New Member" size="normal" disabled={this.submitting} onClick={() => (this.invitingMember = true)} />

        {this.invitingMember && (
          <verdocs-dialog onExit={() => (this.invitingMember = false)}>
            <div slot="title" class="heading">
              Invite New Member
            </div>
            <div class="content">
              <verdocs-text-input
                label="E-mail Address"
                placeholder="Enter the user's email address..."
                id="verdocs-invite-email"
                value={this.newEmailAddress}
                autocomplete="off"
                required={true}
                onInput={(e: any) => (this.newEmailAddress = e.target.value)}
                onFocusout={(e: any) => {
                  this.newEmailAddress = e.target.value.trim();
                }}
              />

              <verdocs-text-input
                label="First"
                placeholder="First name..."
                id="verdocs-invite-first"
                value={this.newFirst}
                autocomplete="off"
                required={true}
                onInput={(e: any) => (this.newFirst = e.target.value)}
                onFocusout={(e: any) => {
                  this.newFirst = e.target.value.trim();
                }}
              />

              <verdocs-text-input
                label="Last"
                placeholder="Enter the user's last name..."
                id="verdocs-invite-last"
                value={this.newLast}
                autocomplete="off"
                required={true}
                onInput={(e: any) => (this.newLast = e.target.value)}
                onFocusout={(e: any) => {
                  this.newLast = e.target.value.trim();
                }}
              />

              <div style={{marginBottom: '20px'}} />

              <verdocs-select-input
                options={roleOptions}
                label="Role"
                onInput={(e: any) => {
                  this.newRole = e.target.value;
                }}
              />

              <div class="buttons">
                <verdocs-button variant="outline" size="small" label="Cancel" disabled={this.submitting} onClick={() => (this.invitingMember = false)} />
                <verdocs-button size="small" label="OK" disabled={this.submitting || !this.newEmailAddress || !this.newRole} onClick={() => this.handleInviteMember()} />
              </div>
            </div>
          </verdocs-dialog>
        )}

        {this.deletingMember && (
          <verdocs-dialog onExit={() => (this.deletingMember = null)}>
            <div slot="title" class="heading">
              Delete Member?
            </div>
            <div class="content">
              <p>Are you sure you want to delete this member? This action cannot be undone.</p>
              <div class="buttons">
                <verdocs-button variant="outline" size="small" disabled={this.submitting} label="Cancel" onClick={() => (this.deletingMember = null)} />
                <verdocs-button size="small" label="OK" disabled={this.submitting} onClick={() => this.handleDeleteMember()} />
              </div>
            </div>
          </verdocs-dialog>
        )}

        {this.deletingInvitation && (
          <verdocs-dialog onExit={() => (this.deletingInvitation = null)}>
            <div slot="title" class="heading">
              Cancel Invitation?
            </div>
            <div class="content">
              <p>Are you sure you want to cancel this invitation? This action cannot be undone.</p>
              <div class="buttons">
                <verdocs-button variant="outline" size="small" disabled={this.submitting} label="Cancel" onClick={() => (this.deletingInvitation = null)} />
                <verdocs-button size="small" label="OK" disabled={this.submitting} onClick={() => this.handleDeleteInvitation()} />
              </div>
            </div>
          </verdocs-dialog>
        )}

        {this.resendingInvitation && (
          <verdocs-dialog onExit={() => (this.resendingInvitation = null)}>
            <div slot="title" class="heading">
              Resend Invitation?
            </div>
            <div class="content">
              <p>The user will receive an email reminder to join your organization.</p>
              <div class="buttons">
                <verdocs-button variant="outline" size="small" disabled={this.submitting} label="Cancel" onClick={() => (this.resendingInvitation = null)} />
                <verdocs-button size="small" label="OK" disabled={this.submitting} onClick={() => this.handleResendInvitation()} />
              </div>
            </div>
          </verdocs-dialog>
        )}
      </Host>
    );
  }
}
