import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import {createReminder, updateReminder, deleteReminder, ICreateTemplateReminderRequest} from '@verdocs/js-sdk/Templates/Reminders';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';
import {VerdocsToast} from '../../../utils/Toast';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';

/**
 * Displays an edit form that allows the user to adjust a template's reminders.
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

  /**
   * Event fired when the user updates the template.
   */
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  @State() showPlanBlocker = false;
  @State() sendReminders = false;
  @State() firstReminderDays = '1';
  @State() reminderDays = '1';
  @State() dirty: boolean = false;

  store: TTemplateStore | null = null;

  // POST https://api.verdocs.com/templates/8337af06-3b5a-4e1b-98be-67d82bc7ecd1/reminder
  // interval_time: 1,
  // setup_time:1,

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

      this.store = await getTemplateStore(this.endpoint, this.templateId, true);

      this.sendReminders = !!this.store?.state?.reminder_id;
      this.dirty = false;
    } catch (e) {
      console.log('[TEMPLATE REMINDERS] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.sendReminders = !!this.store?.state?.reminder_id;
    this.dirty = false;
    this.close?.emit();
  }

  async handleSave(e) {
    e.stopPropagation();
    try {
      if (this.sendReminders) {
        const params: ICreateTemplateReminderRequest = {
          setup_time: +this.firstReminderDays,
          interval_time: +this.reminderDays,
        };

        if (!this.store?.state?.reminder_id) {
          await createReminder(this.endpoint, this.templateId, params);
          this.store = await getTemplateStore(this.endpoint, this.templateId, true);
        } else {
          await updateReminder(this.endpoint, this.templateId, this.store?.state.reminder_id, params);
          this.store = await getTemplateStore(this.endpoint, this.templateId, true);
        }
      } else {
        await deleteReminder(this.endpoint, this.templateId, this.store?.state.reminder_id);
        this.store = await getTemplateStore(this.endpoint, this.templateId, true);
      }
      this.templateUpdated?.emit({endpoint: this.endpoint, template: this.store.state, event: 'attachments'});
    } catch (e) {
      console.log('[TEMPLATE REMINDERS] Unable to update reminders', e);
      VerdocsToast(e.message);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
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
    if (!this.endpoint.session || !this.store?.state?.isLoaded) {
      return <Host class="empty" />;
    }

    return (
      <Host>
        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <h5>Reminders</h5>

          <div class="input-row">
            <label htmlFor="verdocs-send-reminders">Send Automatic Reminders</label>
            <verdocs-checkbox
              id="verdocs-send-reminders"
              name="automatic-reminders"
              checked={this.sendReminders}
              value="on"
              onInput={(e: any) => {
                // this.showPlanBlocker = true;
                // e.target.checked = false;
                this.sendReminders = e.target.checked;
                this.dirty = true;
              }}
            />
          </div>

          <div class="input-row">
            <label htmlFor="verdocs-first-reminder-days">Days Before First Reminder</label>
            <verdocs-text-input
              id="verdocs-first-reminder-days"
              type="number"
              value={this.firstReminderDays}
              onInput={(e: any) => {
                this.firstReminderDays = e.target.value;
                this.dirty = true;
              }}
              disabled={!this.sendReminders}
            />
          </div>
          <div class="input-row">
            <label htmlFor="verdocs-days-between-reminders">Days Between Reminders</label>
            <verdocs-text-input
              id="verdocs-days-between-reminders"
              type="number"
              value={this.reminderDays}
              onInput={(e: any) => {
                this.reminderDays = e.target.value;
                this.dirty = true;
              }}
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
