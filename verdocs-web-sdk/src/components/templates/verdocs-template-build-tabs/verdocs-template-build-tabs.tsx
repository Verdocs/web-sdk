import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, h, Event, EventEmitter, Host, Watch, State} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

const STEPS = ['attachments', 'roles', 'settings', 'fields', 'preview'];
export type TVerdocsBuildStep = 'attachments' | 'roles' | 'settings' | 'fields' | 'preview';

/**
 * Display a set of tabs for the template builder.
 */
@Component({
  tag: 'verdocs-template-build-tabs',
  styleUrl: 'verdocs-template-build-tabs.scss',
  shadow: false,
})
export class VerdocsTemplateBuildTabs {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the template to create the document from. Unlike most other components, this is an optional parameter here.
   * If the template ID is known, `step` may also be specified to force displaying a specific step in the creation process.
   * If it is not specified, `step` will be ignored and the create step will be shown.
   */
  @Prop({reflect: true, mutable: true}) templateId: string | null = null;

  /**
   * The step in the creation process to display.
   */
  @Prop({reflect: true, mutable: true}) step: TVerdocsBuildStep = 'preview';

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the user selects a different step.
   */
  @Event({composed: true}) stepChanged: EventEmitter<TVerdocsBuildStep>;

  @Watch('step')
  onStepChanged() {
    console.log('Step changed', this.step, this.templateId);
    this.loadTemplate().catch((e: any) => console.log('Unknown Error', e));
  }

  @State()
  store: TTemplateStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.endpoint.session) {
        console.log('[BUILD_TABS] Unable to start builder session, must be authenticated');
        return;
      }

      if (!this.templateId) {
        this.step = 'preview';
        return;
      }

      this.loadTemplate().catch(e => console.log('[BUILD_TABS] Unable to load template', e));
    } catch (e) {
      console.log('[BUILD_TABS] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  async loadTemplate() {
    if (this.templateId) {
      this.store = await getTemplateStore(this.endpoint, this.templateId, false);
    }
  }

  setStep(e: any) {
    console.log('Selected step', e.detail.tab.id);
    e.stopPropagation();
    e.preventDefault();
    this.step = e.detail.tab.id;
    this.stepChanged?.emit(e.detail.tab.id);
  }

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    let canPreview = false;
    let canEditFields = false;
    let canEditRoles = false;
    console.log('[BUILD_TABS] Rendering tabs', this.templateId, this.step);
    if (this.templateId && this.store && this.store.state) {
      canEditRoles = this.store?.state?.template_documents?.length > 0;
      canEditFields = canEditRoles && this.store?.state?.roles?.length > 0;
      canPreview = canEditFields && this.store?.state?.fields?.length > 0;
      // TODO
      // canPreview = this.store && userCanPreviewTemplate(this.endpoint.session, this.store?.state);
      // canEditFields = this.store && userCanBuildTemplate(this.endpoint.session, this.store?.state);
      // canEditRoles = this.store && userCanUpdateTemplate(this.endpoint.session, this.store?.state);
    }

    let selectedStepIndex = Math.max(STEPS.indexOf(this.step), 0);
    if (!canPreview && selectedStepIndex >= 4) {
      selectedStepIndex = 3;
    }
    if (!canEditFields && selectedStepIndex >= 3) {
      selectedStepIndex = 1;
    }
    if (!canEditRoles && selectedStepIndex >= 1) {
      selectedStepIndex = 0;
    }

    console.log({selectedStepIndex, canPreview, canEditFields, canEditRoles});

    return (
      <Host>
        <verdocs-tabs
          onSelectTab={e => this.setStep(e)}
          selectedTab={selectedStepIndex}
          tabs={[
            {id: 'attachments', disabled: false, label: this.templateId && this.store ? 'Attachment(s)' : 'Upload Attachment(s)'},
            {id: 'roles', disabled: !canEditRoles, label: 'Roles'},
            {id: 'settings', disabled: !canEditFields, label: 'Settings'},
            {id: 'fields', disabled: !canEditFields, label: 'Fields'},
            {id: 'preview', disabled: !canPreview, label: 'Preview/Send'},
          ]}
        />
      </Host>
    );
  }
}
