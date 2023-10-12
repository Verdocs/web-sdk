import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IRole, ITemplate} from '@verdocs/js-sdk/Templates/Types';
import {Component, Prop, h, Event, EventEmitter, Host, Watch, State} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

export type TVerdocsBuildStep = 'attachments' | 'roles' | 'settings' | 'fields' | 'preview';

/**
 * Display a template building experience.
 */
@Component({
  tag: 'verdocs-build',
  styleUrl: 'verdocs-build.scss',
  shadow: false,
})
export class VerdocsBuild {
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
  @Event({composed: true}) send: EventEmitter<{roles: IRole[]; name: string; template_id: string}>;

  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  /**
   * Event fired when the template is created by the upload step.
   */
  @Event({composed: true}) templateCreated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  @Watch('templateId')
  onTemplateIdChanged() {
    console.log('Template ID changed', this.templateId);
    this.loadTemplate().catch((e: any) => console.log('Unknown Error', e));
  }

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

      if (!this.templateId) {
        console.log(`[BUILD] No template ID, activating upload mode`);
        this.step = 'attachments';
        return;
      }

      if (!this.endpoint.session) {
        console.log('[BUILD] Unable to start builder session, must be authenticated');
        return;
      }

      this.loadTemplate().catch(e => console.log('[BUILD] Unable to load template', e));
    } catch (e) {
      console.log('[BUILD] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  async loadTemplate() {
    if (this.templateId) {
      this.store = await getTemplateStore(this.endpoint, this.templateId, true);
    }
  }

  handleCancel(e: any) {
    console.log('Cancel', e.detail);
    this.step = 'preview';
  }

  async handleTemplateCreated(templateId: string) {
    this.templateId = templateId;
    await this.loadTemplate();
    this.step = 'roles';
    this.stepChanged?.emit('roles');
  }

  async handleTemplateUpdated(e: any) {
    console.log('tup');
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
    console.log('osc', step);
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

    if (!this.templateId || !this.store) {
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
              onExit={e => this.handleCancel(e)}
              onNext={() => this.handleAttachmentsNext()}
              onTemplateCreated={e => this.handleTemplateCreated(e.detail.templateId)}
            />
          </div>
        </Host>
      );
    }

    console.log('[BUILD] Rendering build view', this.step, ['attachments', 'roles', 'settings', 'fields', 'preview'].indexOf(this.step));

    return (
      <Host>
        <div class="content">
          <verdocs-template-build-tabs
            endpoint={this.endpoint}
            templateId={this.templateId}
            step="attachments"
            onSdkError={e => this.sdkError?.emit(e.detail)}
            onStepChanged={e => {
              console.log('osc', e.detail);
            }}
          />

          {this.step === 'attachments' && (
            <verdocs-template-attachments
              templateId={this.templateId}
              endpoint={this.endpoint}
              onExit={e => this.handleCancel(e)}
              onNext={() => this.handleAttachmentsNext()}
              onTemplateUpdated={e => this.handleTemplateUpdated(e)}
            />
          )}

          {this.step === 'roles' && (
            <verdocs-template-roles
              templateId={this.templateId}
              endpoint={this.endpoint}
              onExit={e => this.handleCancel(e)}
              onNext={() => this.handleRolesNext()}
              onTemplateUpdated={e => this.handleTemplateUpdated(e)}
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
            <div style={{flexDirection: 'row', display: 'flex', width: '100%', backgroundColor: '#eeeeee', maxHeight: '100%'}}>
              <div style={{display: 'flex', flex: '0 0 300px', backgroundColor: '#ffffff', boxShadow: '1px 1px 6px -2px #0000007f'}}>
                <verdocs-send templateId={this.templateId} endpoint={this.endpoint} onSend={e => this.send?.emit(e.detail)} style={{width: '100%'}} />
              </div>
              <div style={{display: 'flex', flex: '1', justifyContent: 'center', overflowY: 'scroll'}}>
                <verdocs-preview templateId={this.templateId} endpoint={this.endpoint} style={{display: 'flex', flex: '1', maxWidth: '1000px'}} />
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
