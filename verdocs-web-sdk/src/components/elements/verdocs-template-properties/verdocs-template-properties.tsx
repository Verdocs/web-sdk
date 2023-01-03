import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State} from '@stencil/core';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';
import {SDKError} from '../../../utils/errors';
import TemplateStore from '../../../utils/templateStore';

/**
 * Displays a collection of settings boxes that allow a user to configure a template's behavior.
 */
@Component({
  tag: 'verdocs-template-properties',
  styleUrl: 'verdocs-template-properties.scss',
  shadow: false,
})
export class VerdocsTemplateProperties {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The template ID to edit.
   */
  @Prop() templateId: string = '';

  /**
   * Event fired when the user cancels the dialog.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired when the user completes the step.
   */
  @Event({composed: true}) next: EventEmitter<{name: string; sendReminders: boolean; firstReminderDays: number; reminderDays: number}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() template: ITemplate | null = null;
  @State() name: string = '';
  @State() visibility: string = '';
  @State() sendReminders = false;
  @State() firstReminderDays = '1';
  @State() reminderDays = '1';

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      console.log(`[PROPERTIES] Loading template ${this.templateId}`);
      const template = await getTemplate(this.endpoint, this.templateId);
      if (!template) {
        console.log('[PREVIEW] Unable to load template');
        return;
      }

      console.log('[PROPERTIES] Got template', template);
      this.template = template;
      TemplateStore.template = template;
      this.name = template.name;
      this.sendReminders = template.reminder_id !== null;
    } catch (e) {
      console.log('[PROPERTIES] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.cancel?.emit();
  }

  handleSubmit(e) {
    e.stopPropagation();

    this.next?.emit({
      name: this.name,
      firstReminderDays: +this.firstReminderDays,
      reminderDays: +this.reminderDays,
      sendReminders: this.sendReminders,
    });
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
        <h5>Template Name</h5>
        <fieldset>
          <verdocs-text-input value={this.name} autocomplete="off" onInput={(e: any) => (this.name = e.target.value)} />
        </fieldset>

        <h5>Reminders</h5>
        <fieldset>
          <div class="input-row">
            <label>Send Automatic Reminders</label>
            <verdocs-checkbox name="automatic-reminders" checked={this.sendReminders} value="on" onInput={(e: any) => (this.sendReminders = e.target.checked)} />
          </div>

          <div class="input-row">
            <label>Days Before First Reminder</label>
            <verdocs-text-input value={this.firstReminderDays} onInput={(e: any) => (this.firstReminderDays = e.target.value)} />
          </div>
          <div class="input-row">
            <label>Days Between Reminders</label>
            <verdocs-text-input value={this.reminderDays} onInput={(e: any) => (this.reminderDays = e.target.value)} />
          </div>
        </fieldset>

        <h5>Template Visibility</h5>
        <fieldset>
          <div class="radio-row">
            <verdocs-radio-button name="visibility" checked={true} value="private" onChange={() => (this.visibility = 'private')} />
            <label htmlFor="verdocs-radio-button-visibility-private">
              <div class="title">Private</div>
              <div class="description">Only you can share and use this template</div>
            </label>
          </div>
          <div class="radio-row">
            <verdocs-radio-button name="visibility" checked={true} value="shared" onChange={() => (this.visibility = 'shared')} />
            <label htmlFor="verdocs-radio-button-visibility-shared">
              <div class="title">Shared to your organization</div>
              <div class="description">Give access to your organization to share and use this template</div>
            </label>
          </div>
          <div class="radio-row">
            <verdocs-radio-button name="visibility" checked={true} value="shared_public" onChange={() => (this.visibility = 'shared_public')} />
            <label htmlFor="verdocs-radio-button-visibility-shared_public">
              <div class="title">Shared to your organization and Public</div>
              <div class="description">Give access to your organization to share this template, and anyone on the Web can find and use this template</div>
            </label>
          </div>
          <div class="radio-row">
            <verdocs-radio-button name="visibility" checked={this.visibility === 'public'} value="public" onChange={() => (this.visibility = 'public')} />
            <label htmlFor="verdocs-radio-button-visibility-public">
              <div class="title">Public</div>
              <div class="description">Anyone on the Web can find and use this template</div>
            </label>
          </div>
        </fieldset>

        <div class="buttons">
          <div class="flex-fill" />

          <verdocs-button variant="outline" label="Cancel" size="small" onClick={e => this.handleCancel(e)} />
          <verdocs-button label="OK" size="small" onClick={e => this.handleSubmit(e)} />
        </div>
      </form>
    );
  }
}