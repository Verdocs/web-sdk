import {Event, EventEmitter, Host} from '@stencil/core';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Documents} from '@verdocs/js-sdk/Documents';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {rescale} from '@verdocs/js-sdk/Utils/Fields';
import {Component, Prop, State, h} from '@stencil/core';
import {updateRecipientStatus} from '@verdocs/js-sdk/Documents/Recipients';
import {isValidEmail, isValidPhone} from '@verdocs/js-sdk/Templates/Validators';
import {IDocument, IDocumentField, IRecipient} from '@verdocs/js-sdk/Documents/Types';
import {IPageRenderEvent} from '../verdocs-view/verdocs-view';
import {getFieldId, setControlStyles} from '../../../utils/utils';
import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';

/**
 * Display a document signing experience.
 *
 * ***NOTE: This sample document will reset every 10 minutes...***
 */
@Component({
  tag: 'verdocs-sign',
  styleUrl: 'verdocs-sign.scss',
  shadow: false,
})
export class VerdocsSign {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the document to sign.
   */
  @Prop() documentId: string | null = null;

  /**
   * The name of the role that will be signing.
   */
  @Prop() roleId: string | null = null;

  /**
   * The invite code for the signer.
   */
  @Prop() inviteCode: string | null = null;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() recipient: IRecipient | null = null;

  @State() signerToken = null;
  @State() pdfUrl = null;
  @State() recipientIndex: number = -1;
  @State() document: IDocument | null = null;
  @State() fields: IDocumentField[] = [];

  @State() hasSignature = false;

  @State() nextButtonLabel = 'Start';

  @State() focusedField = '';

  async componentDidLoad() {
    try {
      console.log(`[SIGN] Processing invite code for ${this.documentId} / ${this.documentId}`);
      const {session, recipient, signerToken} = await Documents.getSigningSession(this.endpoint, {
        documentId: this.documentId,
        roleId: this.roleId,
        inviteCode: this.inviteCode,
      });

      console.log(`[SIGN] Got signing session ${session.email} / ${session.profile_id}`);

      this.recipient = recipient;
      this.signerToken = signerToken;
      this.endpoint.setToken(signerToken);

      if (this.recipient.agreed) {
        this.nextButtonLabel = 'Next';
      }

      const document = await Documents.getDocument(this.endpoint, this.documentId);
      this.document = document;
      console.log('[SIGN] Signing document', document);

      this.pdfUrl = `${this.endpoint.getBaseURL()}/documents/${this.documentId}/envelope_documents/${document.envelope_document_id}?file=true`;

      this.recipientIndex = this.document.recipients.findIndex(recipient => recipient.role_name == this.roleId);
      if (this.recipientIndex > -1) {
        console.log('Found recipient', this.document.recipients[this.recipientIndex]);
      }

      this.fields = this.document.fields.filter(field => field.recipient_role === this.roleId);
      console.log('Loaded fields', this.fields);

      // TODO: Fix service to allow this?
      // const sigs = await getSignatures();
      // console.log('sigs', sigs);
    } catch (e) {
      console.log('Error with signing session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleClickAgree() {
    console.log('agree clicked');
    updateRecipientStatus(this.endpoint, this.documentId, this.roleId, 'update', {agreed: true})
      .then(r => {
        console.log('update result', r);
        this.nextButtonLabel = 'Next';
        this.recipient = r;
      })
      .catch(e => {
        console.log('update failure', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  async savePDF() {
    const fileName = `${this.document.name} - ${this.document.updated_at.split('T')[0]}.pdf`;
    const data = await Documents.getDocumentFile(this.endpoint, this.documentId, this.document.envelope_document_id);

    // This is better in React than doing window.href= or similar to trigger a download. For a description of the technique
    // see https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    const url = `data:application/pdf;base64,${data}`;
    console.log('url', url.length, url);
    xhr.open('GET', `data:application/pdf;base64,${data}`);
    xhr.send();
  }

  async handleOptionSelected(e) {
    switch (e.detail.id) {
      case 'later':
        // this.router.navigate([`view/sign/${this.envelopeId}/role/${this.roleName}/saved`]);
        if (!window?.['STORYBOOK_ENV']) {
          window.alert('User intends to sign later.');
        }
        break;
      case 'claim':
        break;
      case 'decline':
        break;
      case 'print':
        break;
      case 'download':
        this.savePDF().catch(() => {});
        break;
    }
  }

  async handleFieldChange(field: IDocumentField, e: any, optionId?: string) {
    console.log('fieldChange', field, e.detail);
    switch (field.type) {
      case 'textbox':
        Documents.updateDocumentField(this.endpoint, this.documentId, field.name, {prepared: false, value: e.detail})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            if (e.response?.status === 401 && e.response?.data?.error === 'jwt expired') {
              console.log('jwt expired');
            }
            console.log('Error updating', e);
          });
        break;

      case 'checkbox_group':
        Documents.updateDocumentField(this.endpoint, this.documentId, field.name, {prepared: false, value: {options: [{id: optionId, checked: e.detail}]}})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            console.log('Error updating', e);
          });
        break;

      case 'radio_button_group':
        const options = field.settings.options.map(option => ({id: option.id, selected: optionId === option.id}));
        Documents.updateDocumentField(this.endpoint, this.documentId, field.name, {prepared: false, value: {options}})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            console.log('Error updating', e);
          });
        break;

      case 'dropdown':
        Documents.updateDocumentField(this.endpoint, this.documentId, field.name, {prepared: false, value: e.detail})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            console.log('Error updating', e);
          });
        break;

      case 'initial':
        console.log('Got initial', e.detail);
        break;

      case 'signature':
        console.log('Got signature', e.detail);
        break;
    }
  }

  renderCheckboxGroupOption(page: IDocumentPageInfo, field: IDocumentField, option: any) {
    const left = rescale(page.xScale, option.x);
    const bottom = rescale(page.yScale, option.y);

    const style = {
      left: `${left}px`,
      bottom: `${bottom}px`,
      position: 'absolute',
      transform: `scale(${page.xScale}, ${page.yScale})`,
      backgroundColor: getRGBA(this.recipientIndex),
    } as any;

    return <verdocs-field-checkbox style={style} field={field} onFieldChange={e => this.handleFieldChange(field, e, option.id)} />;
  }

  renderRadioGroupOption(page: IDocumentPageInfo, field: IDocumentField, option: any) {
    const left = rescale(page.xScale, option.x);
    const bottom = rescale(page.yScale, option.y);

    const style = {
      left: `${left}px`,
      bottom: `${bottom}px`,
      position: 'absolute',
      transform: `scale(${page.xScale}, ${page.yScale})`,
      backgroundColor: getRGBA(this.recipientIndex),
    } as any;

    return <verdocs-field-radio-button style={style} field={field} onFieldChange={e => this.handleFieldChange(field, e, option.id)} />;
  }

  isFieldValid(field: IDocumentField) {
    switch (field.type) {
      case 'textbox':
        switch (field.settings?.validator || '') {
          case 'email':
            return isValidEmail(field.settings?.result || '');
          case 'phone':
            return isValidPhone(field.settings?.result || '');
          default:
            return !!field.settings?.result;
        }

      case 'signature':
      case 'initial':
      case 'textarea':
      case 'date':
      case 'timestamp':
      case 'attachment':
        return !!field.settings?.result;
      case 'dropdown':
        return !!field.settings?.value;
      case 'checkbox_group':
        const checked = (field.settings?.options?.filter(option => option.checked) || []).length;
        return checked >= (field.settings?.minimum_checked || 0) && checked <= (field.settings?.maximum_checked || 999);
      case 'radio_button_group':
        return (field.settings?.options?.filter(option => option.selected) || []).length > 0;
      // TODO
      // case 'checkbox':
      //   return <verdocs-field-checkbox style={style} value={result || ''} id={id} />;
      // case 'payment':
      //   return <verdocs-field-payment style={style} field={field} id={id} />;
      default:
        return false;
    }
  }

  // (async () => {
  //   await customElements.whenDefined('verdocs-field-signature');
  //   const els = document.getElementById('verdocs-field-signature');
  //   await els.focusField();
  // })();

  handleNext() {
    // Find and focus the next incomplete required field
    const requiredFields = this.fields.filter(field => field.required);
    console.log('required Fields', requiredFields);

    const focusedIndex = requiredFields.findIndex(field => field.name === this.focusedField);
    console.log('focused Index', focusedIndex);

    let nextFocusedIndex = focusedIndex + 1;
    if (nextFocusedIndex >= requiredFields.length) {
      nextFocusedIndex = 0;
    }

    const nextRequiredField = requiredFields[nextFocusedIndex];
    console.log('next required field', nextRequiredField);

    if (nextRequiredField) {
      const id = getFieldId(nextRequiredField);
      const el = document.getElementById(id) as any;
      console.log('focusing', id, el);
      el?.focusField();
      this.focusedField = nextRequiredField.name;
    }
  }

  renderField(field: IDocumentField, docPage: IDocumentPageInfo /*, index: number*/) {
    const controlsDiv = document.getElementById(docPage.containerId + '-controls');
    if (!controlsDiv) {
      return;
    }

    const id = getFieldId(field);
    const existingField = document.getElementById(id);
    if (existingField) {
      setControlStyles(existingField, field, docPage.xScale, docPage.yScale, this.recipientIndex);
      return;
    }

    let el;
    switch (field.type) {
      case 'attachment':
      case 'checkbox_group':
      case 'date':
      case 'dropdown':
      case 'initial':
      case 'payment':
      case 'signature':
      case 'timestamp':
      case 'textarea':
      case 'textbox':
        el = document.createElement(`verdocs-field-${field.type}`);
        break;
      //   return field.settings.options.map((option: any, index) => this.renderCheckboxGroupOption(renderOnPage, field, option, index));
      case 'radio_button_group':
        //   el = document.createElement('verdocs-field-signature');
        //   el.setAttribute('value', base64);
        break;
      //   return field.settings.options.map((option: any, index) => this.renderRadioGroupOption(renderOnPage, field, option, index));
      // case 'attachment':
      //   el = document.createElement('verdocs-field-attachment');
      //   el.setAttribute('value', result || '');
      //   break;
      // case 'payment':
      //   el = document.createElement('verdocs-field-payment');
      //   break;
      default:
        console.log('[SIGN] Skipping unsupported field type', field);
    }

    if (el) {
      el.field = field;
      el.recipient = this.recipient;
      el.setAttribute('id', id);
      el.setAttribute('roleindex', this.recipientIndex);
      el.addEventListener('fieldChange', e => this.handleFieldChange(field, e));
      setControlStyles(existingField, field, docPage.xScale, docPage.yScale, this.recipientIndex);
      controlsDiv.appendChild(el);
    }
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IPageRenderEvent;
    console.log('[SIGN] Page rendered', pageInfo);

    const fields = this.fields.filter(field => field.page === pageInfo.renderedPage.pageNumber);
    console.log('[SIGN] Fields on page', fields);
    fields.forEach(field => this.renderField(field, pageInfo.renderedPage));
    // .map((field, index) => this.renderField(field, index));
    // this.pdfPageInfo = e.detail;
  }

  render() {
    const menuOptions = [
      {id: 'later', label: 'Finish Later'}, //
      {id: 'claim', label: 'Claim the Document', disabled: true},
      {id: 'decline', label: 'Decline to Sign'},
      {id: 'print', label: 'Print Without Signing'},
      {id: 'download', label: 'Download'},
    ];

    return (
      <Host class={{storybook: !!window?.['STORYBOOK_ENV'], agreed: this.recipient?.agreed}}>
        <div class="intro">
          <div class="inner">Please review and act on these documents.</div>
        </div>

        <div class="header">
          <div class="inner">
            <div class="toolbar">
              <div class="tools">
                <verdocs-dropdown options={menuOptions} onOptionSelected={e => this.handleOptionSelected(e)} />

                {!this.recipient?.agreed ? (
                  <div class="agree">
                    <div class="agree-checkbox">
                      <input type="checkbox" value="None" id="agree-checkbox-element" name="agree" onChange={() => this.handleClickAgree()} />
                      <label htmlFor="agree-checkbox-element" />
                    </div>
                    <span>I agree to use electronic records and signatures.</span>
                  </div>
                ) : (
                  <div style={{flex: '1'}} />
                )}
                <verdocs-button size="small" label={this.nextButtonLabel} disabled={!this.recipient?.agreed} onClick={() => this.handleNext()} />
              </div>
            </div>
          </div>
        </div>

        {!this.recipient?.agreed ? <div class="cover" /> : <div style={{display: 'none'}} />}

        <div class="document">
          {this.pdfUrl ? (
            <div class="inner">
              <verdocs-view
                source={this.pdfUrl}
                endpoint={this.endpoint}
                onPageRendered={e => this.handlePageRendered(e)}
                pageLayers={[
                  {name: 'page', type: 'canvas'},
                  {name: 'controls', type: 'div'},
                ]}
              />
            </div>
          ) : (
            <verdocs-loader />
          )}
        </div>
      </Host>
    );
  }
}
