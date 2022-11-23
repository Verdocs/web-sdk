import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IRole} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Event, EventEmitter, Prop, State} from '@stencil/core';

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
   * The role that this contact will be assigned to.
   */
  @Prop() templateRole: IRole | null = null;

  /**
   * Event fired when the user cancels the dialog.
   */
  @Event({composed: true}) cancel: EventEmitter;

  @State() sendReminders: boolean = false;

  componentWillLoad() {
    if (this.templateRole) {
      // this.showMessage = this.message !== '';
    }
  }

  handleNameChange(e: any) {
    console.log(e);
    // this.name = e.target.value;
    // this.searchContacts?.emit({query: this.name});
  }

  handleMessageChange(e: any) {
    console.log(e);
    // this.message = e.target.value;
  }

  handleCancel(e) {
    e.stopPropagation();
    this.cancel?.emit();
  }

  handleSubmit(e) {
    e.stopPropagation();

    // this.contactSelected?.emit({
    //   delegator: this.delegator,
    // });
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
        <h5>Template Name</h5>
        <fieldset>
          <verdocs-text-input value="Motor Vehicle Bill of Sale" autocomplete="off" />
        </fieldset>

        <h5>Reminders</h5>
        <fieldset>
          <div class="input-row">
            <label>Send Automatic Reminders</label>
            <verdocs-checkbox name="automatic-reminders" checked={true} />
          </div>

          <div class="input-row">
            <label>Days Before First Reminder</label>
            <verdocs-text-input value="1" />
          </div>
          <div class="input-row">
            <label>Days Between Reminders</label>
            <verdocs-text-input value="1" />
          </div>
        </fieldset>

        <h5>Template Visibility</h5>
        <fieldset>
          <div class="radio-row">
            <verdocs-radio-button name="visibility" checked={true} value="private" />
            <label htmlFor="verdocs-radio-button-visibility-private">
              <div class="title">Private</div>
              <div class="description">Only you can share and use this template</div>
            </label>
          </div>
          <div class="radio-row">
            <verdocs-radio-button name="visibility" checked={true} value="shared" />
            <label htmlFor="verdocs-radio-button-visibility-shared">
              <div class="title">Shared to your organization</div>
              <div class="description">Give access to your organization to share and use this template</div>
            </label>
          </div>
          <div class="radio-row">
            <verdocs-radio-button name="visibility" checked={true} value="shared_public" />
            <label htmlFor="verdocs-radio-button-visibility-shared_public">
              <div class="title">Shared to your organization and Public</div>
              <div class="description">Give access to your organization to share this template, and anyone on the Web can find and use this template</div>
            </label>
          </div>
          <div class="radio-row">
            <verdocs-radio-button name="visibility" checked={true} value="public" />
            <label htmlFor="verdocs-radio-button-visibility-public">
              <div class="title">Public</div>
              <div class="description">Anyone on the Web can find and use this template</div>
            </label>
          </div>
        </fieldset>

        <div class="buttons">
          <div class="flex-fill" />

          <verdocs-button variant="outline" label="Cancel" size="small" onPress={e => this.handleCancel(e)} />
          <verdocs-button label="OK" size="small" onPress={e => this.handleSubmit(e)} />
        </div>
      </form>
    );
  }
}
