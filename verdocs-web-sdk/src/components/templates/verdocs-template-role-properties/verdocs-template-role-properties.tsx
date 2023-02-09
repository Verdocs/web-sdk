import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {deleteRole, updateRole} from '@verdocs/js-sdk/Templates/Roles';
import {TRecipientType} from '@verdocs/js-sdk/Envelopes/Types';
import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';
import {TemplateSenderTypes, TTemplateSender} from '@verdocs/js-sdk/Templates/Types';
import TemplateStore from '../../../utils/templateStore';
import {loadTemplate} from '../../../utils/Templates';
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
  @Prop() sender: TTemplateSender = TemplateSenderTypes.EVERYONE;

  @State() dirty = false;
  @State() saving = false;
  @State() name = '';
  @State() type: TRecipientType = 'signer';
  @State() fullName = '';
  @State() email = '';
  @State() phone = '';
  @State() allowDelegation = false;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[TEMPLATE ROLE PROPERTIES] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[TEMPLATE ROLE PROPERTIES] Unable to start builder session, must be authenticated');
        return;
      }

      try {
        console.log(`[TEMPLATE ROLE PROPERTIES] Loading template ${this.templateId}`, this.endpoint.session);
        await loadTemplate(this.endpoint, this.templateId);
      } catch (e) {
        console.log('[TEMPLATE ROLE PROPERTIES] Error loading template', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      }

      const editingRole = TemplateStore.template.roles.find(role => role.name === this.roleName);
      if (editingRole) {
        this.name = editingRole.name;
        this.type = editingRole.type;
        this.fullName = editingRole.full_name;
        this.email = editingRole.email;
        this.phone = editingRole.phone;
        this.allowDelegation = editingRole.delegator;
        console.log('Got role', editingRole);
      }
    } catch (e) {
      console.log('[TEMPLATE ROLE PROPERTIES] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.name = TemplateStore.template.name;
    this.dirty = false;
    this.close?.emit();
  }

  async handleSave(e) {
    e.stopPropagation();
    this.saving = true;
    updateRole(this.endpoint, this.templateId, this.roleName, {
      name: this.name,
      type: this.type,
      full_name: this.fullName,
      email: this.email,
      phone: this.phone,
      delegator: this.allowDelegation,
    })
      .then(r => {
        console.log('Update result', r);
        this.saving = false;
        this.dirty = false;
        TemplateStore.template.roles.forEach(role => {
          if (role.name === this.roleName) {
            role.name = this.name;
            role.type = this.type;
            role.full_name = this.fullName;
            role.email = this.email;
            role.phone = this.phone;
            role.delegator = this.allowDelegation;
          }
        });
        this.close?.emit();
      })
      .catch(e => {
        console.log('Uopdate error', e);
        this.saving = false;
      });
  }

  async handleDelete(e) {
    e.stopPropagation();
    if (window.confirm('Are you sure you wish to remove this role? All associated fields will be removed as well. This action cannot be undone.')) {
      deleteRole(this.endpoint, this.templateId, this.roleName)
        .then(r => {
          console.log('Role deleted', r);
          TemplateStore.template.roles = [...TemplateStore.template.roles.filter(role => role.name !== this.roleName)];
          this.delete?.emit({templateId: this.templateId, roleName: this.roleName});
        })
        .catch(e => {
          console.log('Deletion error', e);
        });
    }
  }

  render() {
    return (
      <Host>
        <div class="background-overlay" onClick={e => this.handleCancel(e)}>
          <div class="dialog">
            <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
              <verdocs-text-input
                id="verdocs-recipient-name"
                label="Role Name"
                value={this.name}
                autocomplete="off"
                helpText="A unique name to identify the role in the workflow. Submitted data will also be tagged with this value."
                placeholder="Template Name..."
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
                value={this.fullName}
                autocomplete="off"
                helpText="The recipient's full name, if it will always stay the same. Leave blank to supply this value later, when each new envelope is created from the template."
                placeholder="Full Name..."
                onInput={(e: any) => {
                  this.fullName = e.target.value;
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
                    checked={this.allowDelegation}
                    onInput={(e: any) => {
                      this.allowDelegation = e.target.checked;
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
