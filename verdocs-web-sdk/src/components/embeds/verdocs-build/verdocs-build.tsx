import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IRole} from '@verdocs/js-sdk/Templates/Types';
import {Component, Prop, h, Event, EventEmitter, Host} from '@stencil/core';
import {userCanBuildTemplate, userCanPreviewTemplate, userCanUpdateTemplate} from '@verdocs/js-sdk/Templates/Permissions';
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
  @Prop() templateId: string | null = null;

  /**
   * The step in the creation process to display.
   */
  @Prop({reflect: true, mutable: true}) step: TVerdocsBuildStep = null;

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

  store: TTemplateStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[BUILD] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[BUILD] Unable to start builder session, must be authenticated');
        return;
      }

      this.step = 'roles';
      this.store = await getTemplateStore(this.endpoint, this.templateId, true);
    } catch (e) {
      console.log('[BUILD] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleCancel(e: any) {
    console.log('Cancel', e.detail);
    this.step = 'preview';
  }

  handleAttachmentsNext() {
    this.step = 'roles';
    this.stepChanged?.emit('roles');
  }

  handleRolesNext() {
    this.step = 'fields';
    this.stepChanged?.emit('fields');
  }

  setStep(e: any, step: TVerdocsBuildStep) {
    e.stopPropagation();
    e.preventDefault();
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

    const canPreview = userCanPreviewTemplate(this.endpoint.session, this.store.state);
    const canEditFields = userCanBuildTemplate(this.endpoint.session, this.store.state);
    const canEditRoles = userCanUpdateTemplate(this.endpoint.session, this.store.state);

    return (
      <Host>
        <div class="steps">
          <button class={`step ${this.step === 'attachments' ? 'active' : ''}`} onClick={e => this.setStep(e, 'attachments')}>
            Attachments
          </button>
          <button class={`step ${this.step === 'roles' ? 'active' : ''}`} onClick={e => this.setStep(e, 'roles')} disabled={!canEditRoles}>
            Roles
          </button>
          <button class={`step ${this.step === 'settings' ? 'active' : ''}`} onClick={e => this.setStep(e, 'settings')} disabled={!canEditFields}>
            Settings
          </button>
          <button class={`step ${this.step === 'fields' ? 'active' : ''}`} onClick={e => this.setStep(e, 'fields')} disabled={!canEditFields}>
            Fields
          </button>
          <button class={`step ${this.step === 'preview' ? 'active' : ''}`} onClick={e => this.setStep(e, 'preview')} disabled={!canPreview}>
            Preview/Send
          </button>
        </div>

        <div class="content">
          {this.step === 'attachments' && (
            <verdocs-template-attachments templateId={this.templateId} endpoint={this.endpoint} onExit={e => this.handleCancel(e)} onNext={() => this.handleAttachmentsNext()} />
          )}

          {this.step === 'roles' && (
            <verdocs-template-roles templateId={this.templateId} endpoint={this.endpoint} onExit={e => this.handleCancel(e)} onNext={() => this.handleRolesNext()} />
          )}

          {this.step === 'settings' && (
            <div style={{flexDirection: 'column', gap: '20px', display: 'flex', maxWidth: '400px', margin: '20px'}}>
              <verdocs-template-name templateId={this.templateId} endpoint={this.endpoint} style={{backgroundColor: '#ffffff', padding: '20px'}} />
              <verdocs-template-reminders templateId={this.templateId} endpoint={this.endpoint} style={{backgroundColor: '#ffffff', padding: '20px'}} />
              <verdocs-template-visibility templateId={this.templateId} endpoint={this.endpoint} style={{backgroundColor: '#ffffff', padding: '20px'}} />
            </div>
          )}

          {this.step === 'fields' && <verdocs-template-fields templateId={this.templateId} endpoint={this.endpoint} />}

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
