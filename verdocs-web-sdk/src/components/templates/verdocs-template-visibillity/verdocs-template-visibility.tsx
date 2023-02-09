import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {updateTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import TemplateStore from '../../../utils/templateStore';
import {loadTemplate} from '../../../utils/Templates';
import {SDKError} from '../../../utils/errors';

/**
 * Displays an edit form that allows the user to adjust a template's visibility.
 */
@Component({
  tag: 'verdocs-template-visibility',
  styleUrl: 'verdocs-template-visibility.scss',
  shadow: false,
})
export class VerdocsTemplateVisibility {
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

  @State() dirty: boolean = false;
  @State() loading: boolean = true;
  @State() personal: boolean = false;
  @State() public: boolean = false;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      await loadTemplate(this.endpoint, this.templateId);
      this.loading = false;
      this.personal = TemplateStore.template.is_personal;
      this.public = TemplateStore.template.is_public;
      this.dirty = false;
    } catch (e) {
      console.log('[TEMPLATE VISIBILITY] Error loading template', e);
      this.loading = false;
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.personal = TemplateStore.template.is_personal;
    this.public = TemplateStore.template.is_public;
    this.dirty = false;
    this.close?.emit();
  }

  async handleSave(e) {
    e.stopPropagation();
    await updateTemplate(this.endpoint, this.templateId, {is_personal: this.personal, is_public: this.public});
    TemplateStore.template.is_personal = this.personal;
    TemplateStore.template.is_public = this.public;
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
          <h5>Visibility</h5>

          <div class="input-row">
            <label htmlFor="verdocs-is-shared">Shared</label>
            <verdocs-checkbox
              id="verdocs-is-shared"
              name="is-shared"
              checked={!this.personal}
              value="on"
              onInput={(e: any) => {
                this.personal = !e.target.checked;
                this.dirty = true;
              }}
            />
          </div>
          <div class="description">Shared templates are visible to other members of your Organization (if any).</div>

          {/*<div class="input-row">*/}
          {/*  <label htmlFor="verdocs-is-personal">Personal</label>*/}
          {/*  <verdocs-checkbox*/}
          {/*    id="verdocs-is-personal"*/}
          {/*    name="is-personal"*/}
          {/*    checked={this.personal}*/}
          {/*    value="on"*/}
          {/*    onInput={(e: any) => {*/}
          {/*      this.personal = e.target.checked;*/}
          {/*      this.dirty = true;*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*<div class="description">Personal templates are hidden from other members of your Organization (if any).</div>*/}

          <div class="input-row">
            <label htmlFor="verdocs-is-public">Public</label>
            <verdocs-checkbox
              id="verdocs-is-public"
              name="is-public"
              checked={this.public}
              value="on"
              onInput={(e: any) => {
                this.public = e.target.checked;
                this.dirty = true;
              }}
            />
          </div>
          <div class="description">
            Public templates may appear in results when any other user searches for templates. Note that a template may be both Personal and Public, which may be useful if you want
            your template to be found via search but not otherwise displayed to other members of your Organization (if any).
          </div>

          <div class="buttons">
            <verdocs-button size="small" variant="outline" label="Cancel" disabled={!this.dirty} onClick={e => this.handleCancel(e)} />
            <verdocs-button size="small" label="Save" disabled={!this.dirty} onClick={e => this.handleSave(e)} />
          </div>
        </form>
      </Host>
    );
  }
}
