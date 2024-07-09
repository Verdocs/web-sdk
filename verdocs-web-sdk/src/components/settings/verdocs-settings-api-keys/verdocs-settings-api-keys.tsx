import {IApiKey, formatFullName} from '@verdocs/js-sdk';
import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {IProfile, VerdocsEndpoint, deleteApiKey, getApiKeys, getOrganizationMembers, createApiKey, rotateApiKey} from '@verdocs/js-sdk';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

// const ClockIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" /></svg>`;
const TagIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>`;
const UserIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clip-rule="evenodd" /></svg>`;
const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;
const ArrowPathIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>`;

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
  @State() creatingKey = false;
  @State() createdKey: IApiKey | null = null;
  @State() deletingKey: IApiKey | null = null;
  @State() rotatingKey: IApiKey | null = null;
  @State() newApiKeyName = '';
  @State() newApiKeyProfileId = '';
  @State() members: IProfile[] = [];

  componentWillLoad() {
    this.endpoint.loadSession();
    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return;
    }
  }

  async componentDidLoad() {
    this.newApiKeyProfileId = this.endpoint.session.profile_id;
    getOrganizationMembers(this.endpoint)
      .then(mem => {
        this.members = mem;
      })
      .catch((e: any) => {
        console.log('[SETTINGS] Error loading organization members', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
        VerdocsToast('Unable to load API keys. Please try again later', {style: 'error'});
      });

    this.loadKeys();
  }

  loadKeys() {
    getApiKeys(this.endpoint)
      .then(r => {
        this.keys = r;
      })
      .catch(e => {
        console.log('[SETTINGS] Unable to load API keys', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
        VerdocsToast('Unable to load API keys. Please try again later', {style: 'error'});
      });
  }

  async handleDeleteKey() {
    deleteApiKey(this.endpoint, this.deletingKey.client_id)
      .then(() => {
        this.deletingKey = null;
        VerdocsToast('API key deleted', {style: 'success'});
        this.loadKeys();
      })
      .catch(e => {
        this.deletingKey = null;
        console.log('[SETTINGS] Unable to delete API key', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
        VerdocsToast('Unable to delete API key. Please try again later', {style: 'error'});
      });
  }

  async handleRotateKey() {
    rotateApiKey(this.endpoint, this.rotatingKey.client_id)
      .then(r => {
        this.rotatingKey = null;
        VerdocsToast('API key rotated', {style: 'success'});
        this.loadKeys();
        this.createdKey = r;
      })
      .catch(e => {
        this.rotatingKey = null;
        console.log('[SETTINGS] Unable to rotate API key', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
        VerdocsToast('Unable to rotate API key. Please try again later', {style: 'error'});
      });
  }

  async handleCreateKey() {
    // TODO: Add permission dropdown
    createApiKey(this.endpoint, {permission: 'personal', name: this.newApiKeyName, profile_id: this.newApiKeyProfileId})
      .then(r => {
        this.creatingKey = false;
        this.createdKey = r;
        VerdocsToast('API key created', {style: 'success'});
        this.loadKeys();
      })
      .catch(e => {
        this.creatingKey = false;
        console.log('[SETTINGS] Unable to create API key', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
        VerdocsToast('Unable to create API key. Please try again later', {style: 'error'});
      });
  }

  render() {
    const profileOptions = this.members.map(member => ({label: formatFullName(member), value: member.id}));

    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return <Host class="authentication-required">Must be authenticated</Host>;
    }

    return (
      <Host>
        <verdocs-table
          data={this.keys}
          columns={[
            {
              id: 'name',
              header: 'Name',
              renderCell: (_, row) => (
                <div>
                  {/*<div innerHTML={ClockIcon} />*/}
                  <div>{row.name}</div>
                </div>
              ),
            },
            {
              id: 'client_id',
              header: 'Client ID',
              renderCell: (_, row) => (
                <div>
                  <div innerHTML={TagIcon} />
                  <div>{row.client_id}</div>
                </div>
              ),
            },
            {
              id: 'profile_id',
              header: 'Acts as',
              renderCell: (_, row) => (
                <div>
                  <div innerHTML={UserIcon} />
                  <div>{formatFullName(row.profile)}</div>
                </div>
              ),
            },
            {
              id: 'actions',
              header: 'Actions',
              renderCell: (_, row) => (
                <div>
                  <div innerHTML={TrashIcon} onClick={() => (this.deletingKey = row)} />
                  <div innerHTML={ArrowPathIcon} onClick={() => (this.rotatingKey = row)} />
                </div>
              ),
            },
          ]}
        />

        <verdocs-button label="Add API Key" size="normal" onClick={() => (this.creatingKey = true)} />

        {this.deletingKey && (
          <verdocs-dialog onExit={() => (this.deletingKey = null)}>
            <div slot="title" class="heading">
              Delete API key "{this.deletingKey.name}"?
            </div>
            <div class="content">
              <p>Are you sure you want to delete this key? This action cannot be undone.</p>
              <div class="buttons">
                <verdocs-button variant="outline" size="small" label="Cancel" onClick={() => (this.deletingKey = null)} />
                <verdocs-button size="small" label="OK" onClick={() => this.handleDeleteKey()} />
              </div>
            </div>
          </verdocs-dialog>
        )}

        {this.rotatingKey && (
          <verdocs-dialog onExit={() => (this.rotatingKey = null)}>
            <div slot="title" class="heading">
              Rotate API key "{this.rotatingKey.name}"?
            </div>
            <div class="content">
              <p>Are you sure you want to rotate this key? A new client secret will be generated, and the old value will become unusable. This action cannot be undone.</p>
              <div class="buttons">
                <verdocs-button variant="outline" size="small" label="Cancel" onClick={() => (this.rotatingKey = null)} />
                <verdocs-button size="small" label="OK" onClick={() => this.handleRotateKey()} />
              </div>
            </div>
          </verdocs-dialog>
        )}

        {this.creatingKey && (
          <verdocs-dialog onExit={() => (this.creatingKey = false)}>
            <div slot="title" class="heading">
              Create API Key
            </div>
            <div class="content">
              <verdocs-text-input
                label="Name"
                placeholder="API key name..."
                id="verdocs-api-key-name"
                value={this.newApiKeyName}
                autocomplete="off"
                required={true}
                onInput={(e: any) => (this.newApiKeyName = e.target.value)}
                onFocusout={(e: any) => {
                  this.newApiKeyName = e.target.value.trim();
                }}
              />

              <p>API keys must be associated with a profile. Actions performed via API calls using this key will "act as" this profile.</p>

              <verdocs-select-input
                options={profileOptions}
                label="Act as Profile"
                onInput={(e: any) => {
                  this.newApiKeyProfileId = e.target.value;
                }}
              />

              <div class="buttons">
                <verdocs-button variant="outline" size="small" label="Cancel" onClick={() => (this.creatingKey = false)} />
                <verdocs-button size="small" label="OK" onClick={() => this.handleCreateKey()} />
              </div>
            </div>
          </verdocs-dialog>
        )}

        {this.createdKey && (
          <verdocs-dialog onExit={() => (this.createdKey = null)}>
            <div slot="title" class="heading">
              API Key Details
            </div>
            <div class="content">
              <verdocs-text-input label="Name" disabled={true} value={this.createdKey?.name} />
              <verdocs-text-input label="Profile" disabled={true} value={formatFullName(this.createdKey?.profile)} />

              <p>Please save the Client ID and Secret below. Be sure to never expose your secret key in insecure (Web or mobile environments)!</p>

              <verdocs-text-input label="Client ID" disabled={true} value={this.createdKey?.client_id} copyable={true} />
              <verdocs-text-input label="Secret Key" disabled={true} value={this.createdKey?.client_secret} copyable={true} />

              <div class="buttons">
                <verdocs-button size="small" label="Done" onClick={() => (this.createdKey = null)} />
              </div>
            </div>
          </verdocs-dialog>
        )}
      </Host>
    );
  }
}
