import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

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
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired when the user completes the step.
   */
  @Event({composed: true}) next: EventEmitter<{name: string; sendReminders: boolean; firstReminderDays: number; reminderDays: number}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() name: string = '';
  @State() visibility: string = '';
  @State() sendReminders = false;
  @State() firstReminderDays = '1';
  @State() reminderDays = '1';

  store: TTemplateStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[PROPERTIES] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[PROPERTIES] Unable to start builder session, must be authenticated');
        return;
      }

      this.store = await getTemplateStore(this.endpoint, this.templateId, true);

      this.name = this.store?.state?.name;
      this.sendReminders = this.store?.state?.reminder_id !== null;
    } catch (e) {
      console.log('[PROPERTIES] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.exit?.emit();
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
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

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
