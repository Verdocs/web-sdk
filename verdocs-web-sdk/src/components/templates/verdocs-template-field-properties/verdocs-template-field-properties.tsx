import {Component, h, Element, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import {DEFAULT_FIELD_HEIGHTS, DEFAULT_FIELD_WIDTHS, deleteField, ITemplateField, TFieldType, updateField, VerdocsEndpoint} from '@verdocs/js-sdk';
import {getTemplateFieldStore, TTemplateFieldStore, updateStoreField} from '../../../utils/TemplateFieldStore';
import {getTemplateRoleStore, TTemplateRoleStore} from '../../../utils/TemplateRoleStore';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a50021"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;

const HelpIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.925 18q.55 0 .938-.387.387-.388.387-.938 0-.55-.387-.925-.388-.375-.938-.375-.55 0-.925.375t-.375.925q0 .55.375.938.375.387.925.387Zm-.95-3.85h1.95q0-.8.2-1.287.2-.488 1.025-1.288.65-.625 1.025-1.213.375-.587.375-1.437 0-1.425-1.025-2.175Q13.5 6 12.1 6q-1.425 0-2.35.775t-1.275 1.85l1.775.7q.125-.45.55-.975.425-.525 1.275-.525.725 0 1.1.412.375.413.375.888 0 .475-.287.9-.288.425-.713.775-1.075.95-1.325 1.475-.25.525-.25 1.875ZM12 22.2q-2.125 0-3.988-.8-1.862-.8-3.237-2.175Q3.4 17.85 2.6 15.988 1.8 14.125 1.8 12t.8-3.988q.8-1.862 2.175-3.237Q6.15 3.4 8.012 2.6 9.875 1.8 12 1.8t3.988.8q1.862.8 3.237 2.175Q20.6 6.15 21.4 8.012q.8 1.863.8 3.988t-.8 3.988q-.8 1.862-2.175 3.237Q17.85 20.6 15.988 21.4q-1.863.8-3.988.8Zm0-2.275q3.325 0 5.625-2.3t2.3-5.625q0-3.325-2.3-5.625T12 4.075q-3.325 0-5.625 2.3T4.075 12q0 3.325 2.3 5.625t5.625 2.3ZM12 12Z"/></svg>';

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
  el: any;

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
  @Prop({mutable: true}) fieldName: string = '';

  /**
   * If specified, the properties card will have a "back" side with the help text as its content.
   */
  @Prop() helpText?: string = '';

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
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; field: ITemplateField}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() dirty: boolean = false;
  @State() loading: boolean = true;

  @State() label = '';
  @State() type = 'textbox' as TFieldType;
  @State() name = '';
  @State() required = false;
  @State() multiline = false;
  @State() roleName = '';
  @State() group = '';
  @State() fieldType = '';
  @State() options = [];
  @State() placeholder = '';
  @State() defaultValue = '';
  @State() showingHelp = false;

  templateStore: TTemplateStore | null = null;
  fieldStore: TTemplateFieldStore | null = null;
  roleStore: TTemplateRoleStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[FIELD PROPERTIES] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.fieldName) {
        console.error(`[FIELD PROPERTIES] Missing required field name`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[FIELD PROPERTIES] Unable to start builder session, must be authenticated');
        return;
      }

      this.templateStore = await getTemplateStore(this.endpoint, this.templateId);
      this.fieldStore = getTemplateFieldStore(this.templateId);
      this.roleStore = getTemplateRoleStore(this.templateId);

      this.resetForm();
    } catch (e) {
      console.log('[FIELD PROPERTIES] Error loading template', e);
      this.loading = false;
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  resetForm() {
    const field = this.fieldStore.get('fields').find(field => field.name === this.fieldName);
    if (!field) {
      console.log(`[FIELD PROPERTIES] Unable to find field "${this.fieldName}" in fields`);
    } else {
      console.log('[FIELD PROPERTIES]', field);
    }

    this.type = field.type;
    this.name = field.name;
    this.label = field.label;
    this.group = field.group;
    this.roleName = field.role_name;
    this.required = field.required;
    this.fieldType = field.type;
    this.options = field.options || [];
    this.placeholder = field.placeholder || '';
    this.defaultValue = field.default || '';
    this.multiline = field.multiline || false;
    this.dirty = false;
    this.loading = false;
    this.cleanupOptions();
  }

  handleCancel(e: any) {
    e.stopPropagation();

    this.resetForm();
    this.close?.emit();
    document.getElementById('verdocs-template-field-properties')?.remove();
  }

  handleSave(e: any) {
    e.stopPropagation();
    const newProperties = {
      name: this.name,
      role_name: this.roleName,
      required: this.required,
      label: this.label,
      group: this.group,
      multiline: this.multiline,
      placeholder: this.placeholder,
      default: this.defaultValue,
      options: this.options,
    } as Partial<ITemplateField>;

    const field = this.fieldStore.get('fields').find(field => field.name === this.fieldName);
    if (!newProperties.multiline && field.multiline) {
      console.log('Switching off multiline');
      newProperties.width = DEFAULT_FIELD_WIDTHS.textbox;
      newProperties.height = DEFAULT_FIELD_HEIGHTS.textbox;
    }

    console.log('[FIELD PROPERTIES] Will update', this.fieldName, newProperties);
    updateField(this.endpoint, this.templateId, this.fieldName, newProperties)
      .then(updated => {
        updateStoreField(this.fieldStore, this.fieldName, updated);
        this.resetForm();
        this.settingsChanged?.emit({fieldName: this.fieldName, field: updated});
        this.close?.emit();
        document.getElementById('verdocs-template-field-properties')?.remove();
      })
      .catch(() => {
        console.log('[FIELD PROPERTIES] Update failed', e);
      });
  }

  async handleDelete(e: any) {
    e.stopPropagation();
    deleteField(this.endpoint, this.templateId, this.fieldName)
      .then(() => {
        this.fieldStore.set(
          'fields',
          this.fieldStore.get('fields').filter(field => field.name !== this.fieldName),
        );
        this.delete?.emit({templateId: this.templateId, roleName: this.roleName});
        document.getElementById('verdocs-template-field-properties')?.remove();
      })
      .catch(e => {
        console.log('[FIELD PROPERTIES] Deletion error', e);
      });
  }

  cleanupOptions() {
    this.options = [...this.options.filter(opt => (opt.id || '').trim() !== '' || (opt.value || '').trim() !== '')];
    if (!this.options.find(opt => !opt.id && !opt.value)) {
      this.options = [...this.options, {id: '', value: ''}];
    }
  }

  render() {
    // console.log('Rendering field properties', this.fieldStore.get(this.fieldName));
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    // This is meant to be a companion for larger visual experiences so we just go blank on errors for now.
    if (!this.endpoint.session || !this.fieldStore.get('fields').some(field => field.name === this.fieldName)) {
      return <Host class="empty" />;
    }

    if (this.helpText && this.showingHelp) {
      return (
        <Host>
          <h6>
            {capitalize(this.fieldType)} Settings <div style={{flex: '1'}} />
            <div class="help-icon" innerHTML={HelpIcon} onClick={() => (this.showingHelp = false)} />
          </h6>

          <p class="instructions" innerHTML={this.helpText} />
        </Host>
      );
    }

    return (
      <Host id="verdocs-template-field-properties">
        <h6>
          {capitalize(this.fieldType.replace(/_/g, ' '))} Settings <div style={{flex: '1'}} />
          {this.helpText && <div class="help-icon" innerHTML={HelpIcon} onClick={() => (this.showingHelp = true)} />}
        </h6>

        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <div class="row">
            <verdocs-text-input
              id="verdocs-field-name"
              label="Field Name"
              value={this.name}
              autocomplete="off"
              //              helpText="The internal name of the field. Must be unique, and contain only letters, numbers, and dashes. After an envelope is completed, the value entered by the signer will be tagged with this key."
              placeholder="Field Name..."
              onInput={(e: any) => {
                this.name = e.target.value;
                this.dirty = true;
              }}
            />
          </div>

          <div class="row">
            <verdocs-text-input
              id="verdocs-field-label"
              label="Optional Label"
              value={this.label}
              autocomplete="off"
              //              helpText="The internal name of the field. Must be unique, and contain only letters, numbers, and dashes. After an envelope is completed, the value entered by the signer will be tagged with this key."
              placeholder="Optional Label..."
              onInput={(e: any) => {
                this.label = e.target.value;
                this.dirty = true;
              }}
            />
          </div>

          <div class="row">
            <div class="input-label">Role:</div>
            <verdocs-select-input
              value={this.roleName}
              options={this.roleStore.state?.roles.map(role => ({label: role.name, value: role.name}))}
              onInput={(e: any) => {
                this.roleName = e.target.value;
                this.dirty = true;
              }}
            />
            {/*<verdocs-help-icon text="The participant who will complete this field." />*/}
          </div>

          {['textbox', 'textarea'].includes(this.type) && (
            <div class="row" style={{marginTop: '10px', marginBottom: '10px'}}>
              <verdocs-text-input
                id="verdocs-field-value"
                label="Default Value"
                value={this.defaultValue}
                autocomplete="off"
                placeholder="Pre-filled value..."
                onInput={(e: any) => {
                  this.defaultValue = e.target.value;
                  this.dirty = true;
                }}
              />
            </div>
          )}

          {this.type === 'radio' && (
            <div class="row">
              <verdocs-text-input
                id="verdocs-field-label"
                label="Group"
                value={this.group}
                autocomplete="off"
                helpText="Enable exclusive selections. Only one option within the same group may be selected at a time."
                placeholder="Group..."
                onInput={(e: any) => {
                  this.group = (e.target.value || '')
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '');
                  this.dirty = true;
                }}
              />
            </div>
          )}

          {['textbox', 'textarea'].includes(this.type) && (
            <div class="row" style={{marginTop: '10px', marginBottom: '10px'}}>
              <verdocs-text-input
                id="verdocs-field-placeholder"
                label="Placeholder"
                value={this.placeholder}
                autocomplete="off"
                // helpText="Placeholder to display if the field is empty."
                placeholder="Placeholder..."
                onInput={(e: any) => {
                  this.placeholder = e.target.value;
                  this.dirty = true;
                }}
              />
            </div>
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

          {this.type === 'textbox' && (
            <div class="row" style={{marginTop: '15px', marginBottom: '15px'}}>
              <label htmlFor="verdocs-is-multline" class="input-label">
                Multi-Line
              </label>
              <verdocs-checkbox
                id="verdocs-is-multiline"
                name="is-multiline"
                checked={this.multiline}
                value="on"
                onInput={(e: any) => {
                  this.multiline = e.target.checked;
                  this.dirty = true;
                }}
              />
            </div>
          )}

          {this.type === 'dropdown' && (
            <div class="row" style={{marginTop: '15px', marginBottom: '15px'}}>
              <label htmlFor="verdocs-is-required" class="input-label">
                Options
              </label>
            </div>
          )}

          {this.type === 'dropdown' && (
            <div class="options">
              <div class="options-header">
                <div class="options-header-label">ID</div>
                <dev class="options-header-label">Label</dev>
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
                      this.cleanupOptions();
                    }}
                  />
                  <verdocs-text-input
                    id={`verdocs-option-value-${option.id}`}
                    value={option.value}
                    placeholder="Display value"
                    onInput={(e: any) => {
                      this.options[index].value = e.target.value;
                      this.dirty = true;
                      this.cleanupOptions();
                    }}
                  />
                  <button
                    innerHTML={TrashIcon}
                    class="remove-button"
                    onClick={() => {
                      this.options = this.options.filter(opt => opt.id !== option.id);
                      this.dirty = true;
                      this.cleanupOptions();
                    }}
                  />
                </div>
              ))}
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
