import {getTemplate, ITemplate, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, h, Event, EventEmitter, Host, Watch, State} from '@stencil/core';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

export type TVerdocsBuildStep = 'attachments' | 'roles' | 'fields' | 'preview';

interface IBuildTab {
  id: TVerdocsBuildStep;
  label: string;
  disabled: boolean;
}

/**
 * Display a set of tabs for the template builder.
 */
@Component({
  tag: 'verdocs-template-build-tabs',
  styleUrl: 'verdocs-template-build-tabs.scss',
  shadow: false,
})
export class VerdocsTemplateBuildTabs {
  private templateListenerId = null;

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

  @State() loading = true;
  @State() template: ITemplate | null = null;

  disconnectedCallback() {
    this.unlistenToTemplate();
  }

  async listenToTemplate() {
    this.unlistenToTemplate();
    Store.subscribe(
      'templates',
      this.templateId,
      () => getTemplate(this.endpoint, this.templateId),
      false,
      (template: ITemplate) => {
        this.template = template;
        this.loading = false;
      },
    );
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  @Watch('templateId')
  onTemplateIdChanged(newTemplateId: string) {
    console.log('[BUILD_TABS] Template ID changed', newTemplateId);
    this.listenToTemplate();
  }

  @Watch('step')
  onStepChanged(newStep: TVerdocsBuildStep) {
    console.log('[BUILD_TABS] Step changed', newStep);
  }

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();
      if (!this.endpoint.session) {
        console.log('[BUILD_TABS] Unable to start builder session, must be authenticated');
        return;
      }

      if (!this.templateId) {
        this.step = 'attachments';
        console.log('[BUILD_TABS] Missing required template ID, forcing view to attachments');
        return;
      }

      this.listenToTemplate();
    } catch (e) {
      console.log('[BUILD_TABS] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleSelect(tab: IBuildTab) {
    if (tab.disabled || tab.id === this.step) {
      return;
    }
    this.step = tab.id;
    this.stepChanged?.emit(tab.id);
  }

  render() {
    if (this.loading) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    const canEditRoles = (this.template?.documents || []).length > 0;
    const canEditFields = canEditRoles && (this.template?.roles || []).length > 0;
    const canPreview = canEditFields && (this.template?.fields || []).length > 0;

    const tabs: IBuildTab[] = [
      {id: 'attachments', label: 'Attachments', disabled: false},
      {id: 'roles', label: 'Workflow', disabled: !canEditRoles},
      {id: 'fields', label: 'Fields', disabled: !canEditFields},
      {id: 'preview', label: 'Preview & Send', disabled: !canPreview},
    ];

    return (
      <Host>
        {tabs.map(tab => {
          const isActive = tab.id === this.step;
          const classes = ['tab'];
          if (isActive) classes.push('active');
          if (tab.disabled) classes.push('disabled');
          return (
            <div class={classes.join(' ')} onClick={() => this.handleSelect(tab)}>
              <span>{tab.label}</span>
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="19" height="50" viewBox="0 0 19 50">
                <polygon points="0,0 19,25 0,50" fill={isActive ? '#ffffff' : '#e7e7e7'} />
              </svg>
            </div>
          );
        })}
      </Host>
    );
  }
}
