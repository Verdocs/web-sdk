import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import {createReminder, updateReminder, deleteReminder, ICreateTemplateReminderRequest} from '@verdocs/js-sdk/Templates/Reminders';
import TemplateStore from '../../../utils/templateStore';
import {loadTemplate} from '../../../utils/Templates';
import {SDKError} from '../../../utils/errors';

/**
 * Displays a collection of settings boxes that allow a user to configure a template's behavior.
 */
@Component({
  tag: 'verdocs-template-reminders',
  styleUrl: 'verdocs-template-reminders.scss',
  shadow: false,
})
export class VerdocsTemplateReminders {
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
  @Event({composed: true}) close: EventEmitter;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() showPlanBlocker = false;
  @State() sendReminders = false;
  @State() firstReminderDays = '1';
  @State() reminderDays = '1';
  @State() dirty: boolean = false;
  @State() loading: boolean = true;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      await loadTemplate(this.endpoint, this.templateId);
      this.loading = false;
      this.sendReminders = !!TemplateStore.template.reminder_id;
      this.dirty = false;
    } catch (e) {
      console.log('[TEMPLATE REMINDERS] Error loading template', e);
      this.loading = false;
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.sendReminders = !!TemplateStore.template.reminder_id;
    this.dirty = false;
    this.close?.emit();
  }

  async handleSave(e) {
    e.stopPropagation();
    if (this.sendReminders) {
      const params: ICreateTemplateReminderRequest = {
        setup_time: 86400000 * +this.firstReminderDays,
        interval_time: 86400000 * +this.reminderDays,
      };

      if (!TemplateStore.template.reminder_id) {
        await createReminder(this.endpoint, this.templateId, params);
      } else {
        await updateReminder(this.endpoint, this.templateId, TemplateStore.template.reminder_id, params);
      }
    } else {
      await deleteReminder(this.endpoint, this.templateId, TemplateStore.template.reminder_id);
    }

    this.dirty = false;
    this.close?.emit();
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
        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <div class="input-row">
            <label htmlFor="verdocs-send-reminders">Send Automatic Reminders</label>
            <verdocs-checkbox
              id="verdocs-send-reminders"
              name="automatic-reminders"
              checked={this.sendReminders}
              value="on"
              onInput={(e: any) => {
                this.showPlanBlocker = true;
                e.target.checked = false;
                // this.sendReminders = e.target.checked;
                // this.dirty = true;
              }}
            />
          </div>

          <div class="input-row">
            <label htmlFor="verdocs-first-reminder-days">Days Before First Reminder</label>
            <verdocs-text-input
              id="verdocs-first-reminder-days"
              type="number"
              value={this.firstReminderDays}
              onInput={(e: any) => (this.firstReminderDays = e.target.value)}
              disabled={!this.sendReminders}
            />
          </div>
          <div class="input-row">
            <label htmlFor="verdocs-days-between-reminders">Days Between Reminders</label>
            <verdocs-text-input
              id="verdocs-days-between-reminders"
              type="number"
              value={this.reminderDays}
              onInput={(e: any) => (this.reminderDays = e.target.value)}
              disabled={!this.sendReminders}
            />
          </div>

          <div class="buttons">
            <verdocs-button size="small" variant="outline" label="Cancel" disabled={!this.dirty} onClick={e => this.handleCancel(e)} />
            <verdocs-button size="small" label="Save" disabled={!this.dirty} onClick={e => this.handleSave(e)} />
          </div>
        </form>

        {this.showPlanBlocker && (
          <verdocs-ok-dialog heading="Upgrade to access this feature" message="Please upgrade your plan to access this feature." onNext={() => (this.showPlanBlocker = false)} />
        )}
      </Host>
    );
  }
}
