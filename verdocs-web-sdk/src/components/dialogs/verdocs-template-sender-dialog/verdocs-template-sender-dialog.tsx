import {TemplateSenderTypes} from '@verdocs/js-sdk/Templates/Types';
import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';

/**
 * Display a dialog that allows a template sender to be selected.
 */
@Component({
  tag: 'verdocs-template-sender-dialog',
  styleUrl: 'verdocs-template-sender-dialog.scss',
})
export class VerdocsTemplateSenderDialog {
  /**
   * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
   */
  @Prop() value: TemplateSenderTypes = TemplateSenderTypes.EVERYONE;

  /**
   * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
   */
  @Prop() open: boolean = false;

  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason.
   */
  @Event({composed: true}) done: EventEmitter<{sender: TemplateSenderTypes}>;

  @State() newValue: TemplateSenderTypes = TemplateSenderTypes.EVERYONE;

  componentWillLoad() {
    this.newValue = this.value;
  }

  handleCancel() {
    this.cancel.emit();
    this.open = false;
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.className === 'background-overlay') {
      e.preventDefault();
      this.handleCancel();
    }
  }

  handleDone() {
    this.done.emit({sender: this.newValue});
    this.open = false;
  }

  handleSelectSetting(value: TemplateSenderTypes) {
    this.newValue = value;
  }

  render() {
    return (
      <Host style={{display: this.open ? 'block' : 'none'}}>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
            <div class="options">
              <div class="option">
                <verdocs-radio-button
                  checked={this.value === TemplateSenderTypes.EVERYONE}
                  name="template-sender"
                  value={TemplateSenderTypes.EVERYONE}
                  onSelected={() => this.handleSelectSetting(TemplateSenderTypes.EVERYONE)}
                />
                <div class="description">
                  <div class="name">Anyone on the Web</div>
                  <verdocs-help-icon text="Anyone can use this template. (Make its visibility is set to to 'Public' or 'Shared'.)" />
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button
                  checked={this.value === TemplateSenderTypes.EVERYONE_AS_CREATOR}
                  name="template-sender"
                  value={TemplateSenderTypes.EVERYONE_AS_CREATOR}
                  onSelected={() => this.handleSelectSetting(TemplateSenderTypes.EVERYONE_AS_CREATOR)}
                />
                <div class="description">
                  <div class="name">Anyone on the Web as me</div>
                  <verdocs-help-icon text="Anyone can use this template on my behalf. (Make sure its visibility is set to 'Public' or 'Shared'.)" />
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button
                  checked={this.value === TemplateSenderTypes.ORGANIZATION_MEMBER}
                  name="template-sender"
                  value={TemplateSenderTypes.ORGANIZATION_MEMBER}
                  onSelected={() => this.handleSelectSetting(TemplateSenderTypes.ORGANIZATION_MEMBER)}
                />
                <div class="description">
                  <div class="name">Anyone in my organization</div>
                  <verdocs-help-icon text="Anyone in my organization can use this template. (Make sure its visibility is set to 'Shared')" />
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button
                  checked={this.value === TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR}
                  name="template-sender"
                  value={TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR}
                  onSelected={() => this.handleSelectSetting(TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR)}
                />
                <div class="description">
                  <div class="name">Anyone in my organization as me</div>
                  <verdocs-help-icon text="Anyone in my organization can use this template on my behalf. (Make sure its visibility is set to to 'Shared'.)" />
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button
                  checked={this.value === TemplateSenderTypes.CREATOR}
                  name="template-sender"
                  value={TemplateSenderTypes.CREATOR}
                  onSelected={() => this.handleSelectSetting(TemplateSenderTypes.CREATOR)}
                />
                <div class="description">
                  <div class="name">Me</div>
                  <verdocs-help-icon text="Only I can use this template." />
                </div>
              </div>
            </div>

            <div class="buttons">
              <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
              <verdocs-button label="Done" onClick={() => this.handleDone()} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
