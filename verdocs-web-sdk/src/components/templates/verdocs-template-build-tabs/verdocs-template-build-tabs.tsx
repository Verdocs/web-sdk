import {format} from 'date-fns';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, h, Event, EventEmitter, Host, Watch, State} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

const HelpIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#5c6575"><path d="M11.925 18q.55 0 .938-.387.387-.388.387-.938 0-.55-.387-.925-.388-.375-.938-.375-.55 0-.925.375t-.375.925q0 .55.375.938.375.387.925.387Zm-.95-3.85h1.95q0-.8.2-1.287.2-.488 1.025-1.288.65-.625 1.025-1.213.375-.587.375-1.437 0-1.425-1.025-2.175Q13.5 6 12.1 6q-1.425 0-2.35.775t-1.275 1.85l1.775.7q.125-.45.55-.975.425-.525 1.275-.525.725 0 1.1.412.375.413.375.888 0 .475-.287.9-.288.425-.713.775-1.075.95-1.325 1.475-.25.525-.25 1.875ZM12 22.2q-2.125 0-3.988-.8-1.862-.8-3.237-2.175Q3.4 17.85 2.6 15.988 1.8 14.125 1.8 12t.8-3.988q.8-1.862 2.175-3.237Q6.15 3.4 8.012 2.6 9.875 1.8 12 1.8t3.988.8q1.862.8 3.237 2.175Q20.6 6.15 21.4 8.012q.8 1.863.8 3.988t-.8 3.988q-.8 1.862-2.175 3.237Q17.85 20.6 15.988 21.4q-1.863.8-3.988.8Zm0-2.275q3.325 0 5.625-2.3t2.3-5.625q0-3.325-2.3-5.625T12 4.075q-3.325 0-5.625 2.3T4.075 12q0 3.325 2.3 5.625t5.625 2.3ZM12 12Z"/></svg>';

const CopyIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>`;

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

  @State()
  templateStore: TTemplateStore | null = null;

  @Watch('templateId')
  onTemplateIdChanged(newTemplateId: string) {
    console.log('[BUILD_TABS] Template ID changed', newTemplateId);
    this.loadTemplate(newTemplateId).catch((e: any) => console.log('Unknown Error', e));
  }

  @Watch('step')
  onStepChanged(newStep: TVerdocsBuildStep) {
    console.log('[BUILD_TABS] Step changed', newStep);
    this.loadTemplate(this.templateId).catch((e: any) => console.log('Unknown Error', e));
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

      try {
        this.templateStore = await getTemplateStore(this.endpoint, this.templateId, false);
      } catch (e) {
        console.log('[BUILD_TABS] Error loading template', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      }
    } catch (e) {
      console.log('[BUILD_TABS] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  async loadTemplate(templateId: string) {
    if (templateId) {
      this.templateStore = await getTemplateStore(this.endpoint, templateId, false);
    }
  }

  setStep(e: any) {
    console.log('Selected step', e.detail.tab.id);
    e.stopPropagation();
    e.preventDefault();
    this.step = e.detail.tab.id;
    this.stepChanged?.emit(e.detail.tab.id);
  }

  copyTemplateId() {
    navigator.clipboard
      .writeText(this.templateId)
      .then(() => {
        VerdocsToast('Template ID copied', {style: 'success', duration: 3000});
      })
      .catch(e => {
        console.warn('[BUILD_TABS] Error copying to clipboard', e);
        this.sdkError?.emit(e);
      });
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
    if (this.templateId && this.templateStore && this.templateStore.state) {
      canEditRoles = this.templateStore?.state?.documents?.length > 0;
      canEditFields = canEditRoles && this.templateStore?.state?.roles?.length > 0;
      canPreview = canEditFields && this.templateStore?.state?.fields?.length > 0;
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

    return (
      <Host>
        <verdocs-tabs
          onSelectTab={e => this.setStep(e)}
          selectedTab={selectedStepIndex}
          tabs={[
            {id: 'attachments', disabled: false, label: 'Attachment(s)'},
            {id: 'roles', disabled: !canEditRoles, label: 'Roles'},
            {id: 'settings', disabled: !canEditFields, label: 'Settings'},
            {id: 'fields', disabled: !canEditFields, label: 'Fields'},
            {id: 'preview', disabled: !canPreview, label: 'Preview/Send'},
          ]}
        />

        {this.templateId && (
          <div class="info">
            <verdocs-button-panel icon={HelpIcon}>
              <div class="template-details-panel">
                <h6>Template Details</h6>
                <div class="row">
                  <label>ID:</label>
                  <div class="value">{this.templateId}</div>
                  <div class="icon-button" innerHTML={CopyIcon} onClick={() => this.copyTemplateId()} />
                </div>
                <div class="row">
                  <label>Name:</label>
                  <div class="value">{this.templateStore?.state?.name}</div>
                </div>
                <div class="row">
                  <label>Visibility:</label>
                  <div class="value">{this.templateStore?.state?.is_public ? 'Public' : this.templateStore?.state?.is_personal ? 'Private' : 'Shared'}</div>
                </div>
                <div class="row">
                  <label>Created:</label>
                  <div class="value">{this.templateStore?.state?.counter ? format(new Date(this.templateStore?.state?.created_at), 'P p') : ''}</div>
                </div>
                <div class="row">
                  <label>Used:</label>
                  <div class="value">{this.templateStore?.state?.counter} time(s)</div>
                </div>
              </div>
            </verdocs-button-panel>
          </div>
        )}
      </Host>
    );
  }
}
