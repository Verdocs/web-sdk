import {Members} from '@verdocs/js-sdk/Organizations';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IProfile} from '@verdocs/js-sdk/Users/Types';
import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {capitalize} from '@verdocs/js-sdk/Utils/Strings';

const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;

const getRoleLabel = (roles: any[]) => {
  if (roles.find(role => role.name === 'owner') !== undefined) return 'Owner';
  if (roles.find(role => role.name === 'admin') !== undefined) return 'Admin';
  if (roles.find(role => role.name === 'member') !== undefined) return 'Member';
  if (roles.find(role => role.name === 'basic_user') !== undefined) return 'Basic User';
  if (roles.find(role => role.name === 'contact') !== undefined) return 'Contact';
};

const getRoleColor = (roles: any[]) => {
  if (roles.find(role => role.name === 'owner') !== undefined) return '#9333ea';
  if (roles.find(role => role.name === 'admin') !== undefined) return '#2563eb';
  if (roles.find(role => role.name === 'member') !== undefined) return '#16a34a';
  if (roles.find(role => role.name === 'basic_user') !== undefined) return '#ea580c';
  if (roles.find(role => role.name === 'contact') !== undefined) return '#52525B';
};

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

  componentWillLoad() {
    this.endpoint.loadSession();
    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return;
    }
  }

  async componentDidLoad() {
    try {
      this.members = await Members.getMembers(this.endpoint, this.endpoint.session.organization_id);
    } catch (e) {
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      VerdocsToast('Unable to load members. Please try again later');
    }
  }

  render() {
    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return <Host class="authentication-required">Must be authenticated</Host>;
    }

    return (
      <Host>
        <h1>Members</h1>

        <verdocs-table
          data={this.members}
          columns={[
            {
              id: 'name',
              renderHeader: () => 'Member',
              renderCell: (_, row) => (
                <div style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center'}}>
                  <div class="role" style={{backgroundColor: getRoleColor(row.roles)}}>
                    {row.first_name.charAt(0)} {row.last_name.charAt(0)}
                  </div>
                  <span>
                    {capitalize(row.first_name)} {capitalize(row.last_name)}
                  </span>
                </div>
              ),
            },
            {id: 'email', header: 'E-mail Address'},
            {id: 'phone', header: 'Phone Number'},
            {id: 'roles', header: 'Role', renderCell: (_, row) => `${getRoleLabel(row.roles)}`},
            {id: 'actions', header: 'Actions', renderCell: () => <span innerHTML={TrashIcon} onClick={() => {}} />},
          ]}
        />

        <verdocs-button label="Invite New Member" size="normal" disabled={true} />
      </Host>
    );
  }
}
