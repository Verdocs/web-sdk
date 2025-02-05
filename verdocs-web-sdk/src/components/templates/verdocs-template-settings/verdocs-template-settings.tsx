import {Component, h, Element, Event, EventEmitter, Host, Prop, State} from '@stencil/core';
import {getTemplate, ITemplate, TTemplateSender, TTemplateVisibility, updateTemplate, VerdocsEndpoint} from '@verdocs/js-sdk';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Display an edit form that allows the user to adjust a template's roles and workflow.
 */
@Component({
  tag: 'verdocs-template-settings',
  styleUrl: 'verdocs-template-settings.scss',
  shadow: false,
})
export class VerdocsTemplateSettings {
  private templateListenerId = null;

  @Element()
  el: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The template ID to edit.
   */
  @Prop() templateId: string = '';

  /**
   * Event fired when the user clicks to proceed.
   */
  @Event({composed: true}) next: EventEmitter;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  @State() name: string | null = null;
  @State() visibility: TTemplateVisibility = 'private';
  @State() sender: TTemplateSender = 'envelope_creator';
  @State() sendReminders = false;
  @State() initialReminder = 0;
  @State() followupReminders = 0;
  @State() dirty = false;

  @State() loading = true;
  @State() template: ITemplate | null = null;

  disconnectedCallback() {
    this.unlistenToTemplate();
  }

  async listenToTemplate() {
    console.log('[SETTINGS] Loading template', this.templateId);
    this.unlistenToTemplate();
    Store.subscribe(
      'templates',
      this.templateId,
      () => getTemplate(this.endpoint, this.templateId),
      false,
      (template: ITemplate) => {
        console.log('[SETTINGS] Template Updated', template);
        this.template = template;
        this.name = template.name;
        this.visibility = template.visibility;
        this.sender = template.sender;
        this.sendReminders = template.initial_reminder !== null;
        this.initialReminder = template.initial_reminder ? Math.floor(template.initial_reminder / MS_PER_DAY) : null;
        this.followupReminders = template.followup_reminders ? Math.floor(template.followup_reminders / MS_PER_DAY) : null;
        this.dirty = false;
        this.loading = false;
      },
    );
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[SETTINGS] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[SETTINGS] Unable to start builder session, must be authenticated');
        return;
      }

      this.listenToTemplate();
    } catch (e) {
      console.log('[SETTINGS] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel() {
    this.exit?.emit();
  }

  handleSubmit() {
    updateTemplate(this.endpoint, this.templateId, {
      name: this.name,
      visibility: this.visibility,
      sender: this.sender,
      initial_reminder: this.sendReminders ? this.initialReminder * MS_PER_DAY : null,
      followup_reminders: this.sendReminders ? this.followupReminders * MS_PER_DAY : null,
    })
      .then(template => {
        console.log('[SETTINGS] Template Updated', template);
        this.dirty = false;
        this.name = template.name;
        this.visibility = template.visibility;
        this.sender = template.sender;
        this.sendReminders = template.initial_reminder !== null;
        this.initialReminder = template.initial_reminder ? Math.floor(template.initial_reminder / MS_PER_DAY) : null;
        this.followupReminders = template.followup_reminders ? Math.floor(template.followup_reminders / MS_PER_DAY) : null;
        this.templateUpdated?.emit({endpoint: this.endpoint, template, event: 'update'});
        this.next?.emit();
      })
      .catch(e => {
        console.log('[SETTINGS] Error updating template', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
        VerdocsToast(e.response?.data?.error || 'Error updating template, please try again later.');
      });
  }

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    if (this.loading || !this.template) {
      return (
        <Host class="loading">
          <verdocs-loader />
        </Host>
      );
    }

    return (
      <Host>
        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <h5>Settings</h5>

          <div class="row">
            <verdocs-text-input
              id="verdocs-field-name"
              label="Template Name"
              value={this.name}
              autocomplete="off"
              placeholder="Template Name..."
              onInput={(e: any) => {
                this.name = e.target.value;
                this.dirty = true;
              }}
            />
          </div>

          <div class="row">
            <verdocs-select-input
              label="Visibility"
              value={this.visibility}
              onInput={(e: any) => {
                this.visibility = e.target.value;
                this.dirty = true;
              }}
              options={[
                {value: 'private', label: 'Private'},
                {value: 'shared', label: 'Shared'},
                {value: 'public', label: 'Public'},
              ]}
            />
          </div>

          <div class="row">
            <verdocs-select-input
              label="Owner for envelopes created from this template"
              value={this.sender}
              onInput={(e: any) => {
                this.sender = e.target.value;
                this.dirty = true;
              }}
              options={[
                {value: 'envelope_creator', label: 'Envelope Creator'},
                {value: 'template_owner', label: 'Template Owner'},
              ]}
            />
          </div>

          <div class="row">
            <label>Send Reminders</label>
            <verdocs-switch checked={this.sendReminders} onCheckedChange={e => (this.sendReminders = e.detail)} />
          </div>

          {this.sendReminders && (
            <div class="row">
              <verdocs-text-input
                id="verdocs-field-name"
                label="First Reminder (days)"
                value={String(this.initialReminder || 0)}
                autocomplete="off"
                placeholder="Delay in days..."
                onInput={(e: any) => {
                  this.initialReminder = +e.target.value;
                  this.dirty = true;
                }}
              />
            </div>
          )}

          {this.sendReminders && (
            <div class="row">
              <verdocs-text-input
                id="verdocs-field-name"
                label="Follow-up Reminders (days)"
                value={String(this.followupReminders || 0)}
                autocomplete="off"
                placeholder="Delay in days..."
                onInput={(e: any) => {
                  this.followupReminders = +e.target.value;
                  this.dirty = true;
                }}
              />
            </div>
          )}

          <div class="buttons">
            <verdocs-button variant="outline" label="Cancel" size="small" onClick={() => this.handleCancel()} />
            <verdocs-button label="Save" size="small" onClick={() => this.handleSubmit()} disabled={!this.dirty} />
          </div>
        </form>
      </Host>
    );
  }
}
