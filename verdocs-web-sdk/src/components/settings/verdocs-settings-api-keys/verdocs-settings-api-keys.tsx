import {ApiKeys} from '@verdocs/js-sdk/Organizations';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IProfile} from '@verdocs/js-sdk/Users/Types';
import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {IApiKey} from '@verdocs/js-sdk/Organizations/Types';
import {capitalize} from '@verdocs/js-sdk/Utils/Strings';

/**
 * Displays a settings form that allows the user to manage their API keys.
 */
@Component({
  tag: 'verdocs-settings-api-keys',
  styleUrl: 'verdocs-settings-api-keys.scss',
})
export class VerdocsSettingsApiKeys {
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

  @State() keys: IApiKey[] = [];

  componentWillLoad() {
    this.endpoint.loadSession();
    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return;
    }
  }

  async componentDidLoad() {
    try {
      this.keys = await ApiKeys.getKeys(this.endpoint, this.endpoint.session.organization_id);
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
        <h1>API Keys</h1>

        <verdocs-table
          data={this.keys}
          columns={[
            {id: 'name', header: 'Name'},
            {id: 'client_id', header: 'Client ID'},
            {id: 'profile_id', header: 'Acts as', renderCell: (_, row) => `${capitalize(row.profile?.first_name)} ${capitalize(row.profile?.last_name)}`},
          ]}
        />

        <verdocs-button label="Add API Key" size="normal" disabled={true} />
      </Host>
    );
  }
}
