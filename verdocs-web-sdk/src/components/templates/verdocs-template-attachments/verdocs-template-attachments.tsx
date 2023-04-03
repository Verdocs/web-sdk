import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, Host} from '@stencil/core';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

const FileIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>';

/**
 * Displays an edit form that allows the user to view, add, or remove a template's attachments.
 * Note that an active session and valid template ID must be supplied.
 */
@Component({
  tag: 'verdocs-template-attachments',
  styleUrl: 'verdocs-template-attachments.scss',
  shadow: false,
})
export class VerdocsTemplateAttachments {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The template ID to edit.
   */
  @Prop() templateId: string = '';

  /**
   * Event fired when the user cancels the dialog.
   */
  @Event({composed: true}) close: EventEmitter;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  store: TTemplateStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[ROLES] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[ROLES] Unable to start builder session, must be authenticated');
        return;
      }

      this.store = await getTemplateStore(this.endpoint, this.templateId, false);

      this.endpoint.loadSession();
    } catch (e) {
      console.log('[TEMPLATE ATTACHMENTS] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    const templateState = this.store?.state;
    if (!templateState.isLoaded) {
      return (
        <Host class="loading">
          <verdocs-loader />
        </Host>
      );
    }

    // This is meant to be a companion for larger visual experiences so we just go blank on errors for now.
    // Checking
    if (!this.endpoint.session || !templateState.profile_id) {
      return <Host class="empty" />;
    }

    return (
      <Host>
        <h5>Attachments</h5>

        {this.store?.state.template_documents.map(document => (
          <div class="attachment">
            <span innerHTML={FileIcon} />
            {document.name} ({document.page_numbers} page{document.page_numbers > 1 ? 's' : ''})
          </div>
        ))}
      </Host>
    );
  }
}
