import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {updateTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import TemplateStore from '../../../utils/templateStore';
import {loadTemplate} from '../../../utils/Templates';
import {SDKError} from '../../../utils/errors';

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

  @State() name: string = '';
  @State() dirty: boolean = false;
  @State() loading: boolean = true;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      await loadTemplate(this.endpoint, this.templateId);
      this.loading = false;
      this.name = TemplateStore.template.name;
      this.dirty = false;
    } catch (e) {
      console.log('[TEMPLATE NAME] Error loading template', e);
      this.loading = false;
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.name = TemplateStore.template.name;
    this.dirty = false;
    this.close?.emit();
  }

  async handleSave(e) {
    e.stopPropagation();
    await updateTemplate(this.endpoint, this.templateId, {name: this.name});
    TemplateStore.template.name = this.name;
    this.dirty = false;
    this.close?.emit();
  }

  render() {
    if (this.loading) {
      return (
        <Host class="loading">
          <verdocs-loader />
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
          <label htmlFor="verdocs-template-name">Template Name</label>
          <verdocs-text-input
            id="verdocs-template-name"
            value={this.name}
            autocomplete="off"
            placeholder="Template Name..."
            onInput={(e: any) => {
              this.name = e.target.value;
              this.dirty = this.name !== TemplateStore.template.name;
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
