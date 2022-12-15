import {Event, EventEmitter, Host} from '@stencil/core';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, State, h} from '@stencil/core';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';
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

  @State() step = 'create';
  @State() pdfUrl = null;
  @State() template: ITemplate | null = null;

  fields: ITemplateField[] = [];

  async componentDidLoad() {}

  handleCancel(e: any) {
    console.log('Cancel', e.detail);
    this.step = '';
  }

  handleTemplateCreated(e: any) {
    console.log('Created', e.detail);
    this.step = 'properties';
  }

  handlePropertiesUpdated(e: any) {
    console.log('updated', e.detail);
    this.step = 'recipients';
  }

  handleRecipientsUpdated(e: any) {
    console.log('updated', e.detail);
    this.step = 'fields';
  }

  render() {
    return (
      <Host>
        {this.step === 'create' && <verdocs-template-create onCancel={e => this.handleCancel(e)} onTemplateCreated={e => this.handleTemplateCreated(e)} />}
        {this.step === 'properties' && <verdocs-template-properties onCancel={e => this.handleCancel(e)} onSettingsUpdated={e => this.handlePropertiesUpdated(e)} />}
        {this.step === 'recipients' && <verdocs-template-recipients onCancel={e => this.handleCancel(e)} onSettingsUpdated={e => this.handleRecipientsUpdated(e)} />}
        {this.step === 'fields' && <verdocs-template-fields onCancel={e => this.handleCancel(e)} onSettingsUpdated={e => this.handleCancel(e)} />}
      </Host>
    );
  }
}
