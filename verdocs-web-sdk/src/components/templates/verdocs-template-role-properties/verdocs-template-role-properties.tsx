import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';
import {deleteTemplateRole, getTemplate, isValidEmail, ITemplate, TRecipientType, updateTemplateRole, VerdocsEndpoint} from '@verdocs/js-sdk';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a50021"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;

/**
 * Present an editing form suitable for adjusting template-role properties.
 */
@Component({
  tag: 'verdocs-template-role-properties',
  styleUrl: 'verdocs-template-role-properties.scss',
})
export class VerdocsTemplateRoleProperties {
  private templateListenerId = null;

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

  @State() dirty = false;
  @State() saving = false;
  @State() name = '';
  @State() type: TRecipientType = 'signer';
  @State() first_name = '';
  @State() last_name = '';
  @State() email = '';
  @State() phone = '';
  @State() delegator = false;

  @State() loading = true;
  @State() template: ITemplate | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[ROLES] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[ROLES] Unable to start builder session, must be authenticated');
        return;
      }

      this.listenToTemplate();
    } catch (e) {
      console.log('[ROLES Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  disconnectedCallback() {
    this.unlistenToTemplate();
  }

  async listenToTemplate() {
    console.log('[ROLES] Loading tempate', this.templateId);
    this.unlistenToTemplate();
    Store.subscribe(
      'templates',
      this.templateId,
      () => getTemplate(this.endpoint, this.templateId),
      false,
      (template: ITemplate) => {
        console.log('[BUILD] Template Updated', template);
        this.template = template;
        this.loading = false;

        const editingRole = this.template?.roles.find(role => role.name === this.roleName);
        if (editingRole) {
          this.name = editingRole.name;
          this.type = editingRole.type;
          this.first_name = editingRole.first_name;
          this.last_name = editingRole.last_name;
          this.email = editingRole.email;
          this.phone = editingRole.phone;
          this.delegator = editingRole.delegator;
          console.log('[ROLES] Editing role', editingRole);
        }
      },
    );
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    const editingRole = this.template?.roles.find(role => role.name === this.roleName);
    if (editingRole) {
      this.name = editingRole.name;
      this.type = editingRole.type;
      this.first_name = editingRole.first_name;
      this.last_name = editingRole.last_name;
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
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      delegator: this.delegator,
    })
      .then(async r => {
        console.log('[ROLES] Update result', r);
        this.saving = false;
        this.dirty = false;
        const newTemplate = JSON.parse(JSON.stringify(this.template));
        const roleIndex = newTemplate.roles.findIndex(role => role.name === this.roleName);
        if (roleIndex > -1) {
          newTemplate.roles[roleIndex] = r;
        }
        Store.updateTemplate(this.templateId, newTemplate);
        this.close?.emit();
      })
      .catch(e => {
        console.log('[ROLES Update error', e);
        this.saving = false;
      });
  }

  async handleDelete(e) {
    e.stopPropagation();
    if (window.confirm('Are you sure you wish to remove this role? All associated fields will be removed as well. This action cannot be undone.')) {
      deleteTemplateRole(this.endpoint, this.templateId, this.roleName)
        .then(() => {
          const newTemplate = JSON.parse(JSON.stringify(this.template)) as ITemplate;
          newTemplate.roles = newTemplate.roles.filter(role => role.name !== this.roleName);
          Store.getTemplate(this.endpoint, this.templateId, true);
          // Store.updateTemplate(this.templateId, newTemplate);
          this.delete?.emit({templateId: this.templateId, roleName: this.roleName});
          this.close?.emit();
        })
        .catch(e => {
          console.log('[ROLES Deletion error', e);
        });
    }
  }

  render() {
    const hasFields = (this.template?.fields || []).some(field => field.role_name === this.roleName);

    // Either all three should be empty, or all three need to be filled
    const isValid = (!this.email && !this.first_name && !this.last_name) || (isValidEmail(this.email) && !!this.first_name && !!this.last_name);

    return (
      <Host>
        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <div>
            <verdocs-text-input
              id="verdocs-role-name"
              label="Role Name (Must be unique)"
              value={this.name}
              autocomplete="off"
              disabled={hasFields}
              placeholder="Role Name..."
              onInput={(e: any) => {
                this.name = e.target.value;
                this.dirty = true;
              }}
            />

            {hasFields && <div class="instructions">This role has fields assigned and can no longer be renamed.</div>}
            {/*<div class="instructions">{hasFields ? 'This role has fields assigned and can no longer be renamed.' : 'A unique name to identify the role in the workflow.'}</div>*/}
          </div>

          <div>
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
            {/*<div class="instructions">*/}
            {/*  Most participants are Signers. CC roles are notified when documents are signed, but have no other actions. Approvers get notified when signing is completed to perform*/}
            {/*  a final review.*/}
            {/*</div>*/}
          </div>

          <div>
            <div class="input-label">Default Contact Info:</div>

            <div class="first-last">
              <verdocs-text-input
                id="verdocs-recipient-first"
                value={this.first_name}
                autocomplete="off"
                placeholder="First..."
                onInput={(e: any) => {
                  this.first_name = e.target.value;
                  this.dirty = true;
                }}
              />

              <verdocs-text-input
                id="verdocs-recipient-first"
                value={this.last_name}
                autocomplete="off"
                placeholder="Last..."
                onInput={(e: any) => {
                  this.last_name = e.target.value;
                  this.dirty = true;
                }}
              />
            </div>
          </div>

          <div>
            <verdocs-text-input
              id="verdocs-recipient-email"
              value={this.email}
              autocomplete="off"
              placeholder="Email Address..."
              onInput={(e: any) => {
                this.email = e.target.value;
                this.dirty = true;
              }}
            />

            <div style={{height: '15px'}} />

            <div>
              <verdocs-text-input
                id="verdocs-recipient-phone"
                value={this.phone}
                autocomplete="off"
                // helpText="The recipient's phone number, if it will always stay the same. Leave blank to supply this value later, when each new envelope is created from the template."
                placeholder="Phone Number..."
                onInput={(e: any) => {
                  this.phone = e.target.value;
                  this.dirty = true;
                }}
              />
              {/*<div class="instructions">Default name and contact information. This may be changed later when creating and envelope with this template.</div>*/}
            </div>
          </div>

          {/*<div class="row">*/}
          {/*  <div class="input-label">May Delegate:</div>*/}
          {/*  <div class="checkbox-wrapper">*/}
          {/*    <verdocs-checkbox*/}
          {/*      checked={this.delegator}*/}
          {/*      onInput={(e: any) => {*/}
          {/*        this.delegator = e.target.checked;*/}
          {/*        this.dirty = true;*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </div>*/}

          {/*  <verdocs-help-icon text="If enabled, this recipient may delegate their actions to another individual." />*/}
          {/*</div>*/}

          <div class="buttons">
            <button class="delete-button" disabled={this.dirty} onClick={e => this.handleDelete(e)} innerHTML={TrashIcon} />

            <div style={{flex: '1'}} />

            {/*<verdocs-button size="small" variant="outline" label="Cancel" disabled={!this.dirty} onClick={e => this.handleCancel(e)} />*/}
            <verdocs-button size="small" label="Save" disabled={!this.dirty || !isValid} onClick={e => this.handleSave(e)} />
          </div>
        </form>
      </Host>
    );
  }
}
