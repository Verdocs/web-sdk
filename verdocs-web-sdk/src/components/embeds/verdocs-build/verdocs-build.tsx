import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';
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
   * The ID of the template to create the document from.
   */
  @Prop() templateId: string | null = null;

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

  @State() step = 'create';
  @State() pdfUrl = null;
  @State() template: ITemplate | null = null;

  fields: ITemplateField[] = [];

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
    this.step = '';
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
        {this.step === 'roles' && <verdocs-template-roles onExit={e => this.handleCancel(e)} onNext={e => this.handleTemplateCreated(e)} />}
        {this.step === 'fields' && <verdocs-template-fields />}
      </Host>
    );
  }
}
