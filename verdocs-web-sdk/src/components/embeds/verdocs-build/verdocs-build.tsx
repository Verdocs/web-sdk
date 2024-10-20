import {ICreateEnvelopeRecipient, IRole, ITemplate, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, h, Element, Event, EventEmitter, Host, Watch, State} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

export type TVerdocsBuildStep = 'attachments' | 'roles' | 'settings' | 'fields' | 'preview';

/**
 * Display a template building experience. Several event callbacks provide status updates to the
 * parent application to support interface updates.
 *
 * ```ts
 * type TVerdocsBuildStep = 'attachments' | 'roles' | 'settings' | 'fields' | 'preview'
 *
 * interface IEnvelopeSent {
 *   name: string;
 *   template_id: string
 *   recipients: ICreateEnvelopeRecipient[];
 * }
 *
 * interface ITemplateEvent {
 *   event: string
 *   template: ITemplate;
 * }
 *
 * interface IRolesEvent {
 *   event: string
 *   templateId: string;
 *   roles: ITemplateRole[];
 * }
 *
 * <verdocs-build
 *   templateId={templateId}
 *   step="preview"
 *   onAuthenticated={({ detail }: { detail: IAuthStatus }) => console.log('Authentication state:', detail) }}
 *   onStepChanged={({ detail }: { detail: TVerdocsBuildStep }) => { console.log('Step changed', detail) }}
 *   onSend={({ detail }: { detail: IEnvelopeSent }) => { console.log('Step changed', detail) }}
 *   onTemplateUpdated={({ detail }: { detail: ITemplateEvent }) => { console.log('Template updated', detail) }}
 *   onTemplateCreated={({ detail }: { detail: ITemplateEvent }) => { console.log('Template created', detail) }}
 *   onRolesUpdated={({ detail }) => { console.log('Roles updated', detail) }}
 *   onSdkError={({ detail }) => { console.log('SDK error', detail) }}
 *   />
 * ```
 */
@Component({
  tag: 'verdocs-build',
  styleUrl: 'verdocs-build.scss',
  shadow: false,
})
export class VerdocsBuild {
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
  @Event({composed: true}) send: EventEmitter<{recipients: ICreateEnvelopeRecipient[]; name: string; template_id: string}>;

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

  @State()
  templateStore: TTemplateStore | null = null;

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
        return;
      }

      try {
        this.loadTemplate(this.templateId).catch(e => console.log('[BUILD] Unable to load template', e));
      } catch (e) {
        console.log('[BUILD] Error loading template', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      }
    } catch (e) {
      console.log('[BUILD] Error with builder session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  async loadTemplate(templateId: string) {
    if (templateId) {
      this.templateStore = await getTemplateStore(this.endpoint, templateId, false);
    }
  }

  handleCancel() {
    this.step = 'preview';
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
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    if (!this.templateStore) {
      console.log('[BUILD] No template ID, rendering created view');
      return (
        <Host>
          <div class="content">
            <verdocs-template-build-tabs
              endpoint={this.endpoint}
              templateId={this.templateId}
              step="attachments"
              onSdkError={e => this.sdkError?.emit(e.detail)}
              onStepChanged={e => this.handleStepChanged(e.detail)}
            />

            <verdocs-template-create
              endpoint={this.endpoint}
              onExit={() => this.handleCancel()}
              onNext={() => this.handleAttachmentsNext()}
              onTemplateCreated={e => this.handleTemplateCreated(e.detail.templateId)}
            />
          </div>
        </Host>
      );
    }

    console.log('[BUILD] Rendering build view', this.templateId, this.step, ['attachments', 'roles', 'settings', 'fields', 'preview'].indexOf(this.step));

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

          {this.step === 'settings' && (
            <div style={{flexDirection: 'column', gap: '20px', display: 'flex', maxWidth: '400px', margin: '20px'}}>
              <verdocs-template-name
                templateId={this.templateId}
                endpoint={this.endpoint}
                style={{backgroundColor: '#ffffff', padding: '20px'}}
                onTemplateUpdated={e => this.handleTemplateUpdated(e)}
              />
              <verdocs-template-reminders
                templateId={this.templateId}
                endpoint={this.endpoint}
                style={{backgroundColor: '#ffffff', padding: '20px'}}
                onTemplateUpdated={e => this.handleTemplateUpdated(e)}
              />
              <verdocs-template-visibility
                templateId={this.templateId}
                endpoint={this.endpoint}
                style={{backgroundColor: '#ffffff', padding: '20px'}}
                onTemplateUpdated={e => this.handleTemplateUpdated(e)}
              />
            </div>
          )}

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
