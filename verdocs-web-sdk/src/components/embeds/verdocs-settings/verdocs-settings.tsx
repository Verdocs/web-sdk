import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Event, EventEmitter, Host, Component, Prop, h, State} from '@stencil/core';
import {SDKError} from '../../../utils/errors';

/**
 * Display a template preview experience. This will display the template's attached
 * documents with signing fields overlaid on each page. Fields will be color-coded
 * by recipient, and will be read-only (cannot be filled, moved, or altered).
 */
@Component({
  tag: 'verdocs-settings',
  styleUrl: 'verdocs-settings.scss',
  shadow: false,
})
export class VerdocsSettings {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() tab = 'profile';

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();
      if (!this.endpoint.session) {
        console.log('[SETTINGS] Unable to start session, must be authenticated');
        return;
      }
    } catch (e) {
      console.log('[SETTINGS] Error with session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  render() {
    console.log('sess', this.endpoint.session);
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    return (
      <Host>
        <div class="tabs">
          <div class={`tab ${this.tab === 'profile' ? 'active' : ''}`} onClick={() => (this.tab = 'profile')}>
            Profile
          </div>
          <div class={`tab ${this.tab === 'organization' ? 'active' : ''}`} onClick={() => (this.tab = 'organization')}>
            Organization
          </div>
          <div class={`tab ${this.tab === 'members' ? 'active' : ''}`} onClick={() => (this.tab = 'members')}>
            Members
          </div>
          <div class={`tab ${this.tab === 'apikeys' ? 'active' : ''}`} onClick={() => (this.tab = 'apikeys')}>
            API Keys
          </div>
        </div>

        {this.tab === 'profile' && <verdocs-settings-profile endpoint={this.endpoint} />}
        {this.tab === 'organization' && <verdocs-settings-organization endpoint={this.endpoint} />}
        {this.tab === 'members' && <verdocs-settings-members endpoint={this.endpoint} />}
        {this.tab === 'apikeys' && <verdocs-settings-api-keys endpoint={this.endpoint} />}
      </Host>
    );
  }
}
