import {getTemplate, ICreateEnvelopeRecipientFromTemplate, IRole, ITemplate, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, h, Element, Event, EventEmitter, Host, Watch, State} from '@stencil/core';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';
import { VerdocsToast } from '../../../utils/Toast';

export type TVerdocsBuildStep = 'attachments' | 'roles' | 'settings' | 'fields' | 'preview';

/**
 * Display a template building experience. Several event callbacks provide status updates to the
 * parent application to support interface updates.
 *
 * ```ts
 * <verdocs-build
 *   templateId={TEMPLATE_ID} step="preview"
 *   onSend={({detail}) => { console.log('Sent envelope from template', detail) }}
 *   onSdkError={({ detail }) => { console.log('SDK error', detail) }
 *   />
 * ```
 */
@Component({
  tag: 'verdocs-build',
  styleUrl: 'verdocs-build.scss',
  shadow: false,
})
export class VerdocsBuild {
  private templateListenerId = null;

  @Element() el!: any;

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
   * Event fired if the user clicks Cancel.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the user selects a different step.
   */
  @Event({composed: true}) stepChanged: EventEmitter<TVerdocsBuildStep>;

  /**
   * The user completed the Send form and clicked send.
   */
  @Event({composed: true}) send: EventEmitter<{recipients: ICreateEnvelopeRecipientFromTemplate[]; name: string; template_id: string}>;

  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  /**
   * Event fired when the template is created by the upload step.
   */
  @Event({composed: true}) templateCreated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  /**
   * Event fired when roles are updated in the roles step.
   */
  @Event({composed: true}) rolesUpdated: EventEmitter<{endpoint: VerdocsEndpoint; templateId: string; event: 'added' | 'deleted' | 'updated'; roles: IRole[]}>;

  @State() loading = true;
  @State() template: ITemplate | null = null;

  @Watch('templateId')
  onTemplateIdChanged(newTemplateId: string, oldTemplateId: string) {
    if (!oldTemplateId && newTemplateId && this.step === 'attachments') {
      this.step = 'preview';
    }

    this.loadTemplate(newTemplateId).catch((e: any) => console.log('Unknown Error', e));
  }

  @Watch('step')
  onStepChanged() {
    // We reload the template here even if only the step changed in case
    // we were out of sync before
    this.loadTemplate(this.templateId).catch((e: any) => console.log('Unknown Error', e));
  }

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();
      if (!this.endpoint.session) {
        console.log('[BUILD] Unable to start builder session, must be authenticated');
        return;
      }

      if (!this.templateId) {
        console.log(`[BUILD] No template ID, activating upload mode`);
        this.step = 'attachments';
        this.loading = false;
        return;
      }

      try {
        this.loadTemplate(this.templateId).catch(e => console.log('[BUILD] Unable to load template', e));
      } catch (e) {
        console.log('[BUILD] Error loading template', e);
        VerdocsToast('Unable to load template: ' + e.message, {style: 'error'});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      }
    } catch (e) {
      console.log('[BUILD] Error with builder session', e);
      VerdocsToast('Unable to load template: ' + e.message, {style: 'error'});
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  async loadTemplate(templateId: string) {
    if (templateId) {
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
  }

  disconnectedCallback() {
    console.log('[BUILD] Disconnected');
    this.unlistenToTemplate();
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  handleCancel() {
    this.step = 'preview';
    this.cancel?.emit();
  }

  async handleTemplateCreated(templateId: string) {
    await this.loadTemplate(templateId);
    this.templateId = templateId;
    this.step = 'roles';
    this.stepChanged?.emit('roles');
  }

  async handleRolesUpdated(e: any) {
    this.templateUpdated?.emit(e.detail);
  }

  async handleTemplateUpdated(e: any) {
    this.templateUpdated?.emit(e.detail);
  }

  handleAttachmentsNext() {
    this.step = 'roles';
    this.stepChanged?.emit('roles');
  }

  handleRolesNext() {
    this.step = 'fields';
    this.stepChanged?.emit('fields');
  }

  handleStepChanged(step: TVerdocsBuildStep) {
    this.step = step;
    this.stepChanged?.emit(step);
  }

  render() {
    if (this.loading) {
      return (
        <Host class="loading">
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

    return (
      <Host>
        <div class="content">
          <verdocs-template-build-tabs
            endpoint={this.endpoint}
            templateId={this.templateId}
            step={this.step}
            onSdkError={e => this.sdkError?.emit(e.detail)}
            onStepChanged={e => this.handleStepChanged(e.detail)}
          />

          {this.step === 'attachments' && (
            <verdocs-template-attachments
              templateId={this.templateId}
              endpoint={this.endpoint}
              onExit={() => this.handleCancel()}
              onNext={() => this.handleAttachmentsNext()}
              onTemplateUpdated={e => this.handleTemplateUpdated(e)}
            />
          )}

          {this.step === 'roles' && (
            <verdocs-template-roles
              templateId={this.templateId}
              endpoint={this.endpoint}
              onExit={() => this.handleCancel()}
              onNext={() => this.handleRolesNext()}
              onRolesUpdated={e => this.handleRolesUpdated(e)}
            />
          )}

          {this.step === 'settings' && <verdocs-template-settings templateId={this.templateId} endpoint={this.endpoint} onTemplateUpdated={e => this.handleTemplateUpdated(e)} />}

          {this.step === 'fields' && <verdocs-template-fields templateId={this.templateId} endpoint={this.endpoint} onTemplateUpdated={e => this.handleTemplateUpdated(e)} />}

          {this.step === 'preview' && (
            <div class="preview-container">
              <div class="preview-send-wrapper">
                <verdocs-send templateId={this.templateId} endpoint={this.endpoint} onSend={e => this.send?.emit(e.detail)} style={{width: '100%'}} />
              </div>
              <div class="preview-preview-wrapper">
                <verdocs-preview templateId={this.templateId} endpoint={this.endpoint} style={{display: 'flex', flex: '1', maxWidth: '1000px'}} />
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
