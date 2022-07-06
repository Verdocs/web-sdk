import {Host} from '@stencil/core';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {rescale} from '@verdocs/js-sdk/Utils/Fields';
import {VerdocsEndpoint} from '@verdocs/js-sdk/HTTP';
import {Component, Prop, State, h} from '@stencil/core';
import {updateRecipientStatus} from '@verdocs/js-sdk/Documents/Recipients';
import {getEndpoint, setActiveEndpoint} from '@verdocs/js-sdk/HTTP/Transport';
import {isValidEmail, isValidPhone} from '@verdocs/js-sdk/Templates/Validators';
import {getSigningSession, getDocument, getDocumentFile, IDocument, IDocumentField, updateDocumentField} from '@verdocs/js-sdk/Documents/Documents';
import {IPDFPageInfo, IPDFRenderEvent} from '../verdocs-view/verdocs-view';

const BASE_URL = 'https://stage-api.verdocs.com';

/**
 * Display a document signing experience.
 */
@Component({
  tag: 'verdocs-sign',
  styleUrl: 'verdocs-sign.scss',
})
export class VerdocsSign {
  /**
   * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a
   * signing session.
   */
  @Prop() documentid: string | null = null;

  /**
   * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a
   * signing session.
   */
  @Prop() roleid: string | null = null;

  /**
   * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a
   * signing session.
   */
  @Prop() invitecode: string | null = null;

  @State() endpoint = null;
  @State() recipient = null;

  @State() signerToken = null;
  @State() pdfUrl = null;
  @State() recipientIndex: number = -1;
  @State() document: IDocument | null = null;
  @State() fields: IDocumentField[] = [];
  @State() pdfPageInfo: IPDFRenderEvent;

  @State() hasSignature = false;

  @State() nextButtonLabel = 'Start';

  @State() focusedField = '';

  componentWillLoad() {
    const endpoint = new VerdocsEndpoint().setBaseURL(BASE_URL);
    setActiveEndpoint(endpoint);
  }

  async componentDidLoad() {
    try {
      console.log('[SIGN] Processing invite code', this.documentid, this.roleid, this.invitecode);
      const {session, recipient, signerToken} = await getSigningSession({
        documentId: this.documentid,
        roleId: this.roleid,
        inviteCode: this.invitecode,
      });
      console.log('[SIGN] Got signing session', session);
      console.log('[SIGN] Recipient', recipient);
      this.recipient = recipient;
      this.signerToken = signerToken;
      getEndpoint().setSigningAuthorization(signerToken);

      if (this.recipient.agreed) {
        this.nextButtonLabel = 'Next';
      }

      const document = await getDocument(this.documentid);
      this.document = document;
      console.log('[SIGN] Document', document);

      this.pdfUrl = `${BASE_URL}/documents/${this.documentid}/envelope_documents/${document.envelope_document_id}?file=true`;

      this.recipientIndex = this.document.recipients.findIndex(recipient => recipient.role_name == this.roleid);
      if (this.recipientIndex > -1) {
        console.log('Found recipient', this.document.recipients[this.recipientIndex]);
      }

      this.fields = this.document.fields.filter(field => field.recipient_role === this.roleid);
      console.log('Loaded fields', this.fields);

      // TODO: Fix service to allow this?
      // const sigs = await getSignatures();
      // console.log('sigs', sigs);
    } catch (e) {
      console.log('Error with signing session', e);
    }
  }

  handleClickAgree() {
    console.log('agree clicked');
    updateRecipientStatus(this.documentid, this.roleid, 'update', {agreed: true})
      .then(r => {
        console.log('update result', r);
        this.nextButtonLabel = 'Next';
        this.recipient = r;
      })
      .catch(e => {
        console.log('update failure', e);
      });
  }

  async savePDF() {
    const fileName = `${this.document.name} - ${this.document.updated_at.split('T')[0]}.pdf`;
    const data = await getDocumentFile(this.documentid, this.document.envelope_document_id);

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
        updateDocumentField(this.documentid, field.name, {prepared: false, value: e.detail})
          .then(r => console.log('Update result', r))
          .catch(e => console.log('Error updating', e));
        break;

      case 'checkbox_group':
        updateDocumentField(this.documentid, field.name, {prepared: false, value: {options: [{id: optionId, checked: e.detail}]}})
          .then(r => console.log('Update result', r))
          .catch(e => console.log('Error updating', e));
        break;

      case 'radio_button_group':
        const options = field.settings.options.map(option => ({id: option.id, selected: optionId === option.id}));
        updateDocumentField(this.documentid, field.name, {prepared: false, value: {options}})
          .then(r => console.log('Update result', r))
          .catch(e => console.log('Error updating', e));
        break;

      case 'dropdown':
        updateDocumentField(this.documentid, field.name, {prepared: false, value: e.detail})
          .then(r => console.log('Update result', r))
          .catch(e => console.log('Error updating', e));
        break;

      case 'initial':
        console.log('Got initial', e.detail);
        break;

      case 'signature':
        console.log('Got signature', e.detail);
        break;
    }
  }

  renderCheckboxGroupOption(page: IPDFPageInfo, field: IDocumentField, option: any, index: number) {
    const left = rescale(page.xRatio, option.x);
    const bottom = rescale(page.yRatio, option.y);

    const style = {
      left: `${left}px`,
      bottom: `${bottom}px`,
      position: 'absolute',
      transform: `scale(${page.xRatio}, ${page.yRatio})`,
      backgroundColor: getRGBA(this.recipientIndex),
    } as any;

    return <verdocs-field-checkbox style={style} order={index} value={option.checked} onFieldChange={e => this.handleFieldChange(field, e, option.id)} />;
  }

  renderRadioGroupOption(page: IPDFPageInfo, field: IDocumentField, option: any, index: number) {
    const left = rescale(page.xRatio, option.x);
    const bottom = rescale(page.yRatio, option.y);

    const style = {
      left: `${left}px`,
      bottom: `${bottom}px`,
      position: 'absolute',
      transform: `scale(${page.xRatio}, ${page.yRatio})`,
      backgroundColor: getRGBA(this.recipientIndex),
    } as any;

    return (
      <verdocs-field-radio-button
        style={style}
        order={index}
        value={option.id}
        name={field.name}
        checked={option.selected}
        onFieldChange={e => this.handleFieldChange(field, e, option.id)}
      />
    );
  }

  renderField(field: IDocumentField, index: number) {
    const {required = false, settings = {} as any} = field;
    const {x = 0, y = 0, base64 = '', placeholder = '', options = [], value = '', result = ''} = settings;

    const renderOnPage = this.pdfPageInfo.pages.find(page => page.pageNumber === field.page);
    if (!renderOnPage) {
      console.log('Unable to render invalid field', field);
      return <div class="invalid-field">Invalid field.</div>;
    }

    const left = rescale(renderOnPage.xRatio, x);
    const bottom = rescale(renderOnPage.yRatio, y);

    const style = {
      left: `${left}px`,
      bottom: `${bottom}px`,
      position: 'absolute',
      transform: `scale(${renderOnPage.xRatio}, ${renderOnPage.yRatio})`,
      backgroundColor: field.settings.rgba || getRGBA(this.recipientIndex),
    } as any;

    if (field.settings.height) {
      style.height = `${field.settings.height}px`;
    }

    if (field.settings.width) {
      style.width = `${field.settings.width}px`;
    }

    console.log('rendering field', field.type, field);

    const id = `field-${field.name}`;
    switch (field.type) {
      case 'signature':
        return <verdocs-field-signature style={style} value={base64} required={required} id={id} />;
      case 'initial':
        return <verdocs-field-initial style={style} required={required} id={id} />;
      case 'textbox':
        return <verdocs-field-textbox style={style} order={index} value={result || ''} placeholder={placeholder} id={id} onFieldChange={e => this.handleFieldChange(field, e)} />;
      case 'textarea':
        return <verdocs-field-textarea style={style} placeholder={placeholder || ''} id={id} />;
      case 'date':
        return <verdocs-field-date style={style} order={index} value={result || ''} placeholder={placeholder} required={required} id={id} />;
      case 'dropdown':
        return <verdocs-field-dropdown style={style} options={options} value={value} required={required} id={id} onFieldChange={e => this.handleFieldChange(field, e)} />;
      case 'checkbox':
        return <verdocs-field-checkbox style={style} value={result || ''} id={id} />;
      case 'checkbox_group':
        return field.settings.options.map((option: any, index) => this.renderCheckboxGroupOption(renderOnPage, field, option, index));
      case 'radio_button_group':
        return field.settings.options.map((option: any, index) => this.renderRadioGroupOption(renderOnPage, field, option, index));
      case 'attachment':
        return <verdocs-field-attachment style={style} value={result || ''} id={id} />;
      case 'payment':
        return <verdocs-field-payment style={style} field={field} id={id} />;
      default:
        console.log('[SIGN] Skipping unsupported field type', field);
    }

    return <div style={{display: 'none'}}>Unsupported field type "{field.type}"</div>;
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

  handleDocumentRendered(e) {
    console.log('[SIGN] Document rendered', e.detail);
    this.pdfPageInfo = e.detail;
  }

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
    console.log('next required fielod', nextRequiredField);

    if (nextRequiredField) {
      const el = document.getElementById(`field-${nextRequiredField.name}`) as any;
      el?.focusField();
      this.focusedField = nextRequiredField.name;
    }
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
        <div class="header">
          <div class="intro">Please review and act on these documents.</div>
          <div class="toolbar">
            <div class="tools">
              <verdocs-dropdown options={menuOptions} onOptionSelected={e => this.handleOptionSelected(e)} />

              {!this.recipient?.agreed ? (
                <div style={{flex: '1', flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
                  <div class="agree-checkbox">
                    <input type="checkbox" value="None" id="agree-checkbox-element" name="agree" onChange={() => this.handleClickAgree()} />
                    <label htmlFor="agree-checkbox-element" />
                  </div>
                  I agree to use electronic records and signatures.
                </div>
              ) : (
                <div style={{flex: '1'}} />
              )}
              <verdocs-button label={this.nextButtonLabel} disabled={!this.recipient?.agreed} onClick={() => this.handleNext()} />
            </div>
          </div>
        </div>

        {!this.recipient?.agreed ? <div class="cover" /> : <div style={{display: 'none'}} />}

        <div class="document">
          {this.pdfUrl ? <verdocs-view source={this.pdfUrl} token={this.signerToken} onDocumentRendered={e => this.handleDocumentRendered(e)} /> : <verdocs-loader />}
          {(this.pdfPageInfo?.pages || []).map(page => (
            <div class="page-controls" style={{height: `${page.height}px`, width: `${page.width}px`, top: `${page.canvasTop}px`, margin: '0 auto'}}>
              {this.pdfPageInfo?.numRendered > 0 ? (
                this.fields.filter(field => field.page === page.pageNumber).map((field, index) => this.renderField(field, index))
              ) : (
                <div style={{display: 'none'}}>Waiting for PDF to render...</div>
              )}
            </div>
          ))}
        </div>
      </Host>
    );
  }
}
