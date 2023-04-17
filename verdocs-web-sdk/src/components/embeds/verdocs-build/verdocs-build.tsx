import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';
import {Component, Prop, State, h, Event, EventEmitter, Host} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

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
  @Prop({reflect: true}) step: 'create' | 'attachments' | 'roles' | 'settings' | 'fields' | 'preview' = null;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) stepChanged: EventEmitter<string>;

  @State() template: ITemplate | null = null;

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
    this.stepChanged?.emit('');
  }

  handleTemplateCreated(e: any) {
    console.log('Created', e.detail);
    this.step = 'roles';
    this.stepChanged?.emit('roles');
  }

  handleRolesDone(e: any) {
    console.log('Roles', e.detail);
    this.step = 'fields';
    this.stepChanged?.emit('fields');
  }

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    return (
      <Host>
        {this.step === 'create' && <verdocs-template-create onExit={e => this.handleCancel(e)} onNext={e => this.handleTemplateCreated(e)} />}
        {this.step === 'attachments' && (
          <verdocs-template-attachments templateId={this.templateId} onExit={e => this.handleCancel(e)} onNext={e => this.handleTemplateCreated(e)} />
        )}
        {this.step === 'roles' && <verdocs-template-roles onExit={e => this.handleCancel(e)} onNext={e => this.handleTemplateCreated(e)} />}
        {this.step === 'settings' && <verdocs-template-settings templateId={this.templateId} />}
        {this.step === 'fields' && <verdocs-template-fields templateId={this.templateId} />}
        {this.step === 'preview' && <verdocs-template-preview />}
      </Host>
    );
  }
}
