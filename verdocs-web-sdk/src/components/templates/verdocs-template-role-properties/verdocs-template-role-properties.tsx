import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';
import {deleteTemplateRole, TRecipientType, TTemplateSenderType, updateTemplateRole, VerdocsEndpoint} from '@verdocs/js-sdk';
import {deleteStoreRole, getTemplateRoleStore, TTemplateRoleStore, updateStoreRole} from '../../../utils/TemplateRoleStore';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a50021"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;

/**
 * Display an edit form that allows the user to adjust a role's setitngs.
 */
@Component({
  tag: 'verdocs-template-role-properties',
  styleUrl: 'verdocs-template-role-properties.scss',
})
export class VerdocsTemplateRoleProperties {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The template ID to edit.
   */
  @Prop() templateId: string = '';

  /**
   * The role name to edit.
   */
  @Prop() roleName: string = '';

  /**
   * Event fired when the user cancels the dialog.
   */
  @Event({composed: true}) close: EventEmitter;

  /**
   * Event fired when the user deletes the role. The parent should update its UI to reflect the removal. When this event is emitted,
   * the role will have already been deleted server-side.
   */
  @Event({composed: true}) delete: EventEmitter<{templateId: string; roleName: string}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
   */
  @Prop() sender: TTemplateSenderType = 'everyone';

  @State() dirty = false;
  @State() saving = false;
  @State() name = '';
  @State() type: TRecipientType = 'signer';
  @State() full_name = '';
  @State() email = '';
  @State() phone = '';
  @State() delegator = false;

  templateStore: TTemplateStore | null = null;
  fieldStore: TTemplateFieldStore | null = null;
  roleStore: TTemplateRoleStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[ROLE_PROPERTIES] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[ROLE_PROPERTIES] Unable to start builder session, must be authenticated');
        return;
      }

      this.templateStore = await getTemplateStore(this.endpoint, this.templateId, false);
      this.fieldStore = getTemplateFieldStore(this.templateId);
      // FIXME: This was createTemplateRoleStore, which it didn't have to be. But that shouldn't break anything,
      //  and using create() will reload the roles from the TEMPLATE, not the server. Creating/deleting roles
      //  isn't updating the template, so if you add a role and then pop this dialog the store will be reloaded
      //  without the newly-added role in place causing the dialog (and future role edits) to break. We should
      //  a) when creating/updating/deleting roles, update the template/store not just the roles, and b) review
      //  and confirm that all things that look at roles are mapped to the role store, not the template.
      this.roleStore = getTemplateRoleStore(this.templateId);

      const editingRole = this.roleStore.state.roles.find(role => role.name === this.roleName);
      if (editingRole) {
        this.name = editingRole.name;
        this.type = editingRole.type;
        this.full_name = editingRole.full_name;
        this.email = editingRole.email;
        this.phone = editingRole.phone;
        this.delegator = editingRole.delegator;
        console.log('[ROLE_PROPERTIES] Editing role', editingRole);
      }
    } catch (e) {
      console.log('[ROLE_PROPERTIES Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    const editingRole = this.roleStore.state.roles.find(role => role.name === this.roleName);
    if (editingRole) {
      this.name = editingRole.name;
      this.type = editingRole.type;
      this.full_name = editingRole.full_name;
      this.email = editingRole.email;
      this.phone = editingRole.phone;
      this.delegator = editingRole.delegator;
    }

    this.dirty = false;
    this.close?.emit();
  }

  async handleSave(e) {
    e.stopPropagation();
    this.saving = true;
    updateTemplateRole(this.endpoint, this.templateId, this.roleName, {
      name: this.name,
      type: this.type,
      full_name: this.full_name,
      email: this.email,
      phone: this.phone,
      delegator: this.delegator,
    })
      .then(async r => {
        console.log('[ROLE_PROPERTIES] Update result', r);
        this.saving = false;
        this.dirty = false;
        updateStoreRole(this.roleStore, this.roleName, r);
        this.close?.emit();
      })
      .catch(e => {
        console.log('[ROLE_PROPERTIES Update error', e);
        this.saving = false;
      });
  }

  async handleDelete(e) {
    e.stopPropagation();
    if (window.confirm('Are you sure you wish to remove this role? All associated fields will be removed as well. This action cannot be undone.')) {
      deleteTemplateRole(this.endpoint, this.templateId, this.roleName)
        .then(() => {
          deleteStoreRole(this.roleStore, this.roleName);
          this.delete?.emit({templateId: this.templateId, roleName: this.roleName});
        })
        .catch(e => {
          console.log('[ROLE_PROPERTIES Deletion error', e);
        });
    }
  }

  render() {
    const hasFields = this.fieldStore.get('fields').some(field => field.role_name === this.roleName);

    return (
      <Host>
        <div class="background-overlay" onClick={e => this.handleCancel(e)}>
          <div class="dialog">
            <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
              <verdocs-text-input
                id="verdocs-role-name"
                label="Role Name"
                value={this.name}
                autocomplete="off"
                disabled={hasFields}
                helpText={
                  hasFields
                    ? 'This role has fields assigned and can no longer be renamed.'
                    : 'A unique name to identify the role in the workflow. Submitted data will also be tagged with this value.'
                }
                placeholder="Role Name..."
                onInput={(e: any) => {
                  this.name = e.target.value;
                  this.dirty = true;
                }}
              />

              <div class="row">
                <div class="input-label">Type:</div>
                <verdocs-select-input
                  value={this.type}
                  options={[
                    {label: 'Signer', value: 'signer'},
                    {label: 'CC', value: 'cc'},
                    {label: 'Approver', value: 'approver'},
                  ]}
                  onInput={(e: any) => {
                    this.type = e.target.value;
                    this.dirty = true;
                  }}
                />
                <verdocs-help-icon text="Most participants are Signers. CC roles are notified when documents are signed, but have no other actions. Approvers get notified when signing is completed to perform a final review." />
              </div>

              <verdocs-text-input
                id="verdocs-recipient-email"
                label="Full Name"
                value={this.full_name}
                autocomplete="off"
                helpText="The recipient's full name, if it will always stay the same. Leave blank to supply this value later, when each new envelope is created from the template."
                placeholder="Full Name..."
                onInput={(e: any) => {
                  this.full_name = e.target.value;
                  this.dirty = true;
                }}
              />

              <verdocs-text-input
                id="verdocs-recipient-email"
                label="Email"
                value={this.email}
                autocomplete="off"
                helpText="The recipient's email address, if it will always stay the same. Leave blank to supply this value later, when each new envelope is created from the template."
                placeholder="Email Address..."
                onInput={(e: any) => {
                  this.email = e.target.value;
                  this.dirty = true;
                }}
              />

              <verdocs-text-input
                id="verdocs-recipient-phone"
                label="Phone"
                value={this.phone}
                autocomplete="off"
                helpText="The recipient's phone number, if it will always stay the same. Leave blank to supply this value later, when each new envelope is created from the template."
                placeholder="Phone Number..."
                onInput={(e: any) => {
                  this.phone = e.target.value;
                  this.dirty = true;
                }}
              />

              <div class="row">
                <div class="input-label">May Delegate:</div>
                <div class="checkbox-wrapper">
                  <verdocs-checkbox
                    checked={this.delegator}
                    onInput={(e: any) => {
                      this.delegator = e.target.checked;
                      this.dirty = true;
                    }}
                  />
                </div>
                <verdocs-help-icon text="If enabled, this recipient may delegate their actions to another individual." />
              </div>

              <div class="buttons">
                <button class="delete-button" disabled={this.dirty} onClick={e => this.handleDelete(e)} innerHTML={TrashIcon} />

                <div style={{flex: '1'}} />

                <verdocs-button size="small" variant="outline" label="Cancel" disabled={!this.dirty} onClick={e => this.handleCancel(e)} />
                <verdocs-button size="small" label="Save" disabled={!this.dirty} onClick={e => this.handleSave(e)} />
              </div>
            </form>
          </div>
        </div>
      </Host>
    );
  }
}
