import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {TDocumentFieldType} from '@verdocs/js-sdk/Envelopes/Types';
import {deleteField, updateField} from '@verdocs/js-sdk/Templates/Fields';
import {Component, h, Element, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import TemplateStore from '../../../utils/templateStore';
import {loadTemplate} from '../../../utils/Templates';
import {SDKError} from '../../../utils/errors';

const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a50021"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;

// const PlusIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

/**
 * Displays an edit form that allows the user to adjust a field's settings.
 */
@Component({
  tag: 'verdocs-template-field-properties',
  styleUrl: 'verdocs-template-field-properties.scss',
  shadow: false,
})
export class VerdocsTemplateFieldProperties {
  @Element()
  el;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The template ID to edit.
   */
  @Prop() templateId: string = '';

  /**
   * The field to configure.
   */
  @Prop() fieldName: string = '';

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
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() dirty: boolean = false;
  @State() loading: boolean = true;

  @State() type: TDocumentFieldType = 'signature';
  @State() setting = null as any;
  @State() name = '';
  @State() roleName = '';
  @State() required = false;
  @State() options = [];
  @State() placeholder = '';
  @State() defaultValue = '';

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.error(`[FIELD PROPERTIES] Missing required template ID`);
        return;
      }

      if (!this.fieldName) {
        console.error(`[FIELD PROPERTIES] Missing required field name`);
        return;
      }

      if (!this.endpoint.session) {
        console.error('[FIELD PROPERTIES] Unable to start builder session, must be authenticated');
        return;
      }

      await loadTemplate(this.endpoint, this.templateId);
      const field = TemplateStore.fields.find(field => field.name === this.fieldName);
      if (!field) {
        console.log(`[FIELD PROPERTIES] Unable to find field "${this.fieldName}" in template`);
      }

      this.type = field.type;
      this.name = field.name;
      this.roleName = field.role_name;
      this.required = field.required;
      this.placeholder = field.label; // TODO: Talk about how we want to handle labels/placeholders
      this.defaultValue = field.setting?.value || '';
      this.setting = field.setting || {};
      this.options = field.setting?.options || [];
      this.dirty = false;
      this.loading = false;
    } catch (e) {
      console.log('[FIELD PROPERTIES] Error loading template', e);
      this.loading = false;
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();

    const field = TemplateStore.fields.find(field => field.name === this.fieldName);
    console.log('hc', e, field);
    if (field) {
      this.name = field.name;
      this.roleName = field.role_name;
      this.required = field.required;
      this.placeholder = field.label; // TODO: Talk about how we want to handle labels/placeholders
      this.defaultValue = field.setting?.result || '';
    }

    this.dirty = false;
    this.close?.emit();
  }

  handleSave(e) {
    e.stopPropagation();
    const newProperties = {
      name: this.name,
      required: this.required,
      role_name: this.roleName,
      // TODO: Default value in setting?
    } as Partial<ITemplateField>;

    if (this.type === 'checkbox_group' || this.type === 'radio_button_group') {
      newProperties.setting = this.setting;
      newProperties.setting.options = this.options;
    } else if (this.type === 'dropdown') {
      newProperties.setting = {
        x: this.setting.x,
        y: this.setting.y,
        options: this.options,
      };
    }

    updateField(this.endpoint, this.templateId, this.fieldName, newProperties)
      .then(() => {
        this.dirty = false;
        const field = TemplateStore.fields.find(field => field.name === this.fieldName);
        if (field) {
          field.name = this.name;
          field.role_name = this.roleName;
          field.required = this.required;
          field.label = this.placeholder;
          field.setting.result = this.defaultValue;
        }
        this.settingsChanged?.emit({fieldName: this.fieldName});
        this.close?.emit();
      })
      .catch(() => {
        console.log('Field update failed', e);
      });
  }

  async handleDelete(e) {
    e.stopPropagation();
    if (window.confirm('Are you sure you wish to remove this field? This action cannot be undone.')) {
      deleteField(this.endpoint, this.templateId, this.fieldName)
        .then(r => {
          console.log('Field deleted', r);
          TemplateStore.fields = [...TemplateStore.fields.filter(field => field.name !== this.fieldName)];
          TemplateStore.template.roles.forEach(role => {
            role.fields = [...role.fields.filter(field => field.name !== this.fieldName)];
          });
          this.delete?.emit({templateId: this.templateId, roleName: this.roleName});
        })
        .catch(e => {
          console.log('Deletion error', e);
        });
    }
  }

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    // This is meant to be a companion for larger visual experiences so we just go blank on errors for now.
    if (!this.endpoint.session || !TemplateStore.template) {
      return <Host class="empty" />;
    }

    return (
      <Host>
        <h6>Field Settings</h6>

        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <div class="row">
            <verdocs-text-input
              id="verdocs-field-name"
              label="Field Name"
              value={this.name}
              autocomplete="off"
              helpText="The internal name of the field. Must be unique, and contain only letters, numbers, and dashes. After an envelope is completed, the value entered by the signer will be tagged with this key."
              placeholder="Field Name..."
              onInput={(e: any) => {
                this.name = e.target.value;
                this.dirty = true;
              }}
            />
          </div>

          <div class="row">
            <div class="input-label">Role:</div>
            <verdocs-select-input
              value={this.roleName}
              options={TemplateStore.template.roles.map(role => ({label: role.name, value: role.name}))}
              onInput={(e: any) => {
                this.roleName = e.target.value;
                this.dirty = true;
              }}
            />
            <verdocs-help-icon text="The participant who will complete this field." />
          </div>

          {['textbox', 'textarea'].includes(this.type) && (
            <verdocs-text-input
              id="verdocs-field-placeholder"
              label="Placeholder"
              value={this.name}
              autocomplete="off"
              helpText="Placeholder to display if the field is empty."
              placeholder="Placeholder..."
              onInput={(e: any) => {
                this.placeholder = e.target.value;
                this.dirty = true;
              }}
            />
          )}

          <div class="row" style={{marginTop: '15px', marginBottom: '15px'}}>
            <label htmlFor="verdocs-is-required" class="input-label">
              Required
            </label>
            <verdocs-checkbox
              id="verdocs-is-required"
              name="is-required"
              checked={this.required}
              value="on"
              onInput={(e: any) => {
                this.required = e.target.checked;
                this.dirty = true;
              }}
            />
          </div>

          {['dropdown'].includes(this.type) && (
            <div class="options">
              <div
                class="row"
                style={{
                  marginTop: '15px',
                  marginBottom: '15px',
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '14px',
                  justifyContent: 'center',
                  backgroundColor: '#333333',
                  padding: '5px 8px',
                  color: '#ffffff',
                }}
              >
                Options <verdocs-help-icon text="Each option requires a unique ID and value. The ID will be stored when the user selects an option." />
              </div>

              <div class="row-header">
                <h6>ID</h6>
                <h6>Label</h6>
                <div style={{width: '34px'}} />
              </div>

              {this.options.map((option, index) => (
                <div class="row option-row" key={index}>
                  <verdocs-text-input
                    id={`verdocs-option-id-${option.id}`}
                    value={option.id}
                    placeholder="Unique ID"
                    onInput={(e: any) => {
                      this.options[index].id = e.target.value;
                      this.dirty = true;
                    }}
                  />
                  <verdocs-text-input
                    id={`verdocs-option-value-${option.id}`}
                    value={option.value}
                    placeholder="Display value"
                    onInput={(e: any) => {
                      this.options[index].value = e.target.value;
                      this.dirty = true;
                    }}
                  />
                  <button
                    innerHTML={TrashIcon}
                    class="remove-button"
                    onClick={() => {
                      this.options = this.options.filter(opt => opt.id !== option.id);
                      this.dirty = true;
                    }}
                  />
                </div>
              ))}

              <div class="row-header">
                <button
                  class="add-option-button"
                  onClick={() => {
                    this.options = [...this.options, {id: `option-${this.options.length + 1}`, value: `Option ${this.options.length + 1}`}];
                    this.dirty = true;
                  }}
                >
                  Add Option
                </button>
              </div>
            </div>
          )}

          <div class="buttons">
            <button class="delete-button" disabled={this.dirty} onClick={e => this.handleDelete(e)} innerHTML={TrashIcon} />
            <div style={{flex: '1'}} />
            <verdocs-button size="small" variant="outline" label="Cancel" disabled={!this.dirty} onClick={e => this.handleCancel(e)} />
            <verdocs-button size="small" label="Save" disabled={!this.dirty} onClick={e => this.handleSave(e)} />
          </div>
        </form>
      </Host>
    );
  }
}
