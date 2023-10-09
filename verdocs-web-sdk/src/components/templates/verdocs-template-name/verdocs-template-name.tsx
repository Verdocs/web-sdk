import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {updateTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';

/**
 * Displays an edit form that allows the user to rename a template. Note that an active session and valid template ID must be supplied.
 */
@Component({
  tag: 'verdocs-template-name',
  styleUrl: 'verdocs-template-name.scss',
  shadow: false,
})
export class VerdocsTemplateName {
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

  @State() name: string = '';
  @State() dirty: boolean = false;

  store: TTemplateStore | null = null;

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

      this.store = await getTemplateStore(this.endpoint, this.templateId, false);

      this.name = this.store?.state?.name;
      this.dirty = false;
    } catch (e) {
      console.log('[TEMPLATE NAME] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.name = this.store?.state?.name;
    this.dirty = false;
    console.log('Closing');
    this.close?.emit();
  }

  async handleSave(e) {
    e.stopPropagation();
    await updateTemplate(this.endpoint, this.templateId, {name: this.name});
    if (this.store?.state) {
      this.store.state.name = this.name;
    }
    this.dirty = false;
    this.templateUpdated?.emit({endpoint: this.endpoint, template: this.store.state, event: 'name'});
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

    if (this.store?.state?.isLoading) {
      return (
        <Host class="loading">
          <verdocs-loader />
        </Host>
      );
    }

    return (
      <Host>
        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <label htmlFor="verdocs-template-name">Template Name</label>
          <verdocs-text-input
            id="verdocs-template-name"
            value={this.name}
            autocomplete="off"
            placeholder="Template Name..."
            onInput={(e: any) => {
              this.name = e.target.value;
              this.dirty = this.name !== this.store?.state?.name;
            }}
          />

          <div class="buttons">
            <verdocs-button size="small" variant="outline" label="Cancel" disabled={!this.dirty} onClick={e => this.handleCancel(e)} />
            <verdocs-button size="small" label="Save" disabled={!this.dirty} onClick={e => this.handleSave(e)} />
          </div>
        </form>
      </Host>
    );
  }
}
