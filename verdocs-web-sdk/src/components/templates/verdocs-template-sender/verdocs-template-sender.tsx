import {TTemplateSenderType, updateTemplate, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

/**
 * Display a dialog that allows a template sender to be selected.
 */
@Component({
  tag: 'verdocs-template-sender',
  styleUrl: 'verdocs-template-sender.scss',
})
export class VerdocsTemplateSender {
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
   * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
   */
  @Prop() sender: TTemplateSenderType = 'everyone';

  @State() saving = false;

  store: TTemplateStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[SENDER] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[SENDER] Unable to start builder session, must be authenticated');
        return;
      }

      this.store = await getTemplateStore(this.endpoint, this.templateId, false);

      this.sender = this.store?.state?.sender;
    } catch (e) {
      console.log('[SENDER] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleClose() {
    this.close.emit();
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.className === 'background-overlay') {
      e.preventDefault();
      this.handleClose();
    }
  }

  async handleSelectSetting(value: TTemplateSenderType) {
    this.saving = true;
    updateTemplate(this.endpoint, this.templateId, {sender: value})
      .then(r => {
        console.log('Update result', r);
        if (this.store?.state) {
          this.store.state.sender = value;
        }
        this.saving = false;
        this.sender = value;
      })
      .catch(e => {
        console.log('Error saving', e);
        this.saving = false;
      });
  }

  render() {
    return (
      <Host>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
            <div class="options">
              <div class="option">
                <verdocs-radio-button name="template-sender" value={'everyone'} checked={this.sender === 'everyone'} onInput={() => this.handleSelectSetting('everyone')} />
                <div class="description">
                  <div class="name">Anyone on the Web</div>
                  <verdocs-help-icon text="Anyone can use this template. (Make its visibility is set to to 'Public' or 'Shared'.)" />
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button
                  name="template-sender"
                  value={'everyone_as_creator'}
                  checked={this.sender === 'everyone_as_creator'}
                  onInput={() => this.handleSelectSetting('everyone_as_creator')}
                />
                <div class="description">
                  <div class="name">Anyone on the Web as me</div>
                  <verdocs-help-icon text="Anyone can use this template on my behalf. (Make sure its visibility is set to 'Public' or 'Shared'.)" />
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button
                  name="template-sender"
                  value={'organization_member'}
                  checked={this.sender === 'organization_member'}
                  onInput={() => this.handleSelectSetting('organization_member')}
                />
                <div class="description">
                  <div class="name">Anyone in my organization</div>
                  <verdocs-help-icon text="Anyone in my organization can use this template. (Make sure its visibility is set to 'Shared')" />
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button
                  name="template-sender"
                  value={'organization_member_as_creator'}
                  checked={this.sender === 'organization_member_as_creator'}
                  onInput={() => this.handleSelectSetting('organization_member_as_creator')}
                />
                <div class="description">
                  <div class="name">Anyone in my organization as me</div>
                  <verdocs-help-icon text="Anyone in my organization can use this template on my behalf. (Make sure its visibility is set to to 'Shared'.)" />
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button name="template-sender" value={'creator'} checked={this.sender === 'creator'} onInput={() => this.handleSelectSetting('creator')} />
                <div class="description">
                  <div class="name">Me</div>
                  <verdocs-help-icon text="Only I can use this template." />
                </div>
              </div>
            </div>

            <div class="buttons">
              <verdocs-button label="Close" onClick={() => this.handleClose()} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
