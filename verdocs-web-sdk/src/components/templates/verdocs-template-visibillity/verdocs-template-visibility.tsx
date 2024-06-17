import {ITemplate, updateTemplate, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
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

  /**
   * Event fired when the user updates the template.
   */
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  @State() dirty: boolean = false;
  @State() personal: boolean = false;
  @State() public: boolean = false;

  store: TTemplateStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[VISIBILITY] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[VISIBILITY] Unable to start builder session, must be authenticated');
        return;
      }

      this.store = await getTemplateStore(this.endpoint, this.templateId, false);

      this.personal = this.store?.state?.is_personal || true;
      this.public = this.store?.state?.is_public || false;
      this.dirty = false;
    } catch (e) {
      console.log('[TEMPLATE VISIBILITY] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e) {
    e.stopPropagation();
    this.personal = this.store?.state?.is_personal;
    this.public = this.store?.state?.is_public;
    this.dirty = false;
    this.close?.emit();
  }

  async handleSave(e) {
    e.stopPropagation();
    await updateTemplate(this.endpoint, this.templateId, {is_personal: this.personal, is_public: this.public});
    if (this.store?.state) {
      this.store.state.is_personal = this.personal;
      this.store.state.is_public = this.public;
    }
    this.dirty = false;
    this.templateUpdated?.emit({endpoint: this.endpoint, template: this.store.state, event: 'visibility'});
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
