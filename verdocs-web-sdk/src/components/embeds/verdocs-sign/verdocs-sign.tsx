// import interact from 'interactjs';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {rescale} from '@verdocs/js-sdk/Utils/Fields';
import {updateRecipientStatus} from '@verdocs/js-sdk/Envelopes/Recipients';
import {isValidEmail, isValidPhone} from '@verdocs/js-sdk/Templates/Validators';
import {IEnvelope, IDocumentField, IRecipient} from '@verdocs/js-sdk/Envelopes/Types';
import {Event, EventEmitter, Host, Fragment, Component, Prop, State, h} from '@stencil/core';
import {getFieldId, getRoleIndex, renderDocumentField, setControlStyles} from '../../../utils/utils';
// import {getFieldId, getRoleIndex, renderDocumentField, setControlStyles, updateCssTransform} from '../../../utils/utils';
import {IPageRenderEvent} from '../verdocs-view/verdocs-view';
import TemplateStore from '../../../utils/templateStore';
import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';

/**
 * Display an envelope signing experience. This will display the envelope's attached
 * documents with signing fields overlaid on each page.
 *
 * The component will attempt to initiate a signing session and load the specified
 * envelope. If successful, the recipient's fields will be enabled and the user will
 * be able to sign the envelope's attached documents. If not, an `sdkError` will be
 * thrown and the component will be blank/empty. To provide the best user experience,
 * applications should capture and handle this error to provide the user with
 * instructions/options for next steps based on the application's design and workflow.
 *
 * Unlike other components, this will always create its own endpoint to manage the
 * session session. This endpoint will be included in event callbacks for the
 * convenience of host applications that may wish to make server calls using the
 * signer's credentials once signing is complete (e.g. to obtain copies of
 * the signed attachments.)
 */
@Component({
  tag: 'verdocs-sign',
  styleUrl: 'verdocs-sign.scss',
  shadow: false,
})
export class VerdocsSign {
  endpoint: VerdocsEndpoint = null;

  /**
   * The ID of the envelope to sign.
   */
  @Prop() envelopeId: string | null = null;

  /**
   * The ID of the role that will be signing e.g. 'Recipient 1'
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

  /**
   * Event fired when any field is updated. Note that the current active endpoint is
   * provided as a parameter as a convenience for callers when this coimponent
   */
  @Event({composed: true}) fieldUpdated: EventEmitter<{endpoint: VerdocsEndpoint}>;

  @State() recipient: IRecipient | null = null;
  @State() signerToken = null;
  @State() recipientIndex: number = -1;
  @State() envelope: IEnvelope | null = null;
  @State() fields: IDocumentField[] = [];
  @State() hasSignature = false;
  @State() nextButtonLabel = 'Start';
  @State() focusedField = '';

  async componentDidLoad() {
    if (!this.envelopeId) {
      this.sdkError?.emit(new SDKError('[SIGN] Missing required envelopId', 500, ''));
      return;
    }

    if (!this.roleId) {
      this.sdkError?.emit(new SDKError('[SIGN] Missing required roleId', 500, ''));
      return;
    }

    if (!this.inviteCode) {
      this.sdkError?.emit(new SDKError('[SIGN] Missing required inviteCode', 500, ''));
      return;
    }

    try {
      this.endpoint = new VerdocsEndpoint({sessionType: 'signing'});

      console.log(`[SIGN] Processing invite code for ${this.envelopeId} / ${this.roleId}`);
      const {session, recipient, signerToken} = await Envelopes.getSigningSession(this.endpoint, {
        envelopeId: this.envelopeId,
        roleId: this.roleId,
        inviteCode: this.inviteCode,
      });

      console.log(`[SIGN] Loaded signing session ${session.email} / ${session.profile_id}`);

      this.recipient = recipient;
      this.signerToken = signerToken;
      this.endpoint.setToken(signerToken);

      if (this.recipient.agreed) {
        this.nextButtonLabel = 'Next';
      }

      const envelope = await Envelopes.getEnvelope(this.endpoint, this.envelopeId);
      this.envelope = envelope;
      console.log('[SIGN] Loaded envelope', envelope);

      this.recipientIndex = this.envelope.recipients.findIndex(recipient => recipient.role_name == this.roleId);
      if (this.recipientIndex > -1) {
        console.log('Found recipient', this.envelope.recipients[this.recipientIndex]);
      }

      this.fields = this.envelope.fields.filter(field => field.recipient_role === this.roleId);
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
    updateRecipientStatus(this.endpoint, this.envelopeId, this.roleId, 'update', {agreed: true})
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
    const fileName = `${this.envelope.name} - ${this.envelope.updated_at.split('T')[0]}.pdf`;
    const data = await Envelopes.getEnvelopeFile(this.endpoint, this.envelopeId, this.envelope.envelope_document_id);

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
    console.log('fieldChange', field, e);
    switch (field.type) {
      case 'textbox':
        Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, field.name, {prepared: false, value: e.detail})
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
        Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, field.name, {prepared: false, value: {options: [{id: optionId, checked: e.detail}]}})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            console.log('Error updating', e);
          });
        break;

      case 'radio_button_group':
        const options = field.settings.options.map(option => ({id: option.id, selected: optionId === option.id}));
        Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, field.name, {prepared: false, value: {options}})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            console.log('Error updating', e);
          });
        break;

      case 'dropdown':
        Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, field.name, {prepared: false, value: e.detail})
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

    return <verdocs-field-checkbox style={style} field={field} onChange={e => this.handleFieldChange(field, e, option.id)} />;
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
    console.log('field', id, existingField);
    if (existingField) {
      setControlStyles(existingField, field, docPage.xScale, docPage.yScale);
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
    console.log('created field', el);

    if (el) {
      el.field = field;
      el.recipient = this.recipient;
      el.setAttribute('id', id);
      el.setAttribute('roleindex', this.recipientIndex);
      el.addEventListener('fieldChange', e => this.handleFieldChange(field, e));
      setControlStyles(el, field, docPage.xScale, docPage.yScale);
      controlsDiv.appendChild(el);
    }
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IPageRenderEvent;
    console.log('[SIGN] Page rendered', pageInfo);

    const fields = TemplateStore.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
    // const fields = this.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
    console.log('[SIGN] Fields on page', fields);
    fields.forEach(field => {
      const el = renderDocumentField(field, pageInfo.renderedPage, getRoleIndex(TemplateStore.roleNames, field.role_name), this.handleFieldChange, true, true, true);
      console.log('rendered element', el);
      // const el = renderDocumentField(field, pageInfo.renderedPage, getRoleIndex(this.roles, field.role_name), this.handleFieldChange, true, true, true);
      if (!el) {
        return;
      }

      el.addEventListener('recipientChanged', e => {
        el.setAttribute('roleindex', getRoleIndex(TemplateStore.roleNames, e.detail));
        // el.setAttribute('roleindex', getRoleIndex(this.roles, e.detail));
      });

      el.setAttribute('xScale', pageInfo.renderedPage.xScale);
      el.setAttribute('yScale', pageInfo.renderedPage.yScale);

      // interact(el).draggable({
      //   listeners: {
      //     start(event) {
      //       console.log('[FIELDS] Drag started', event.type, event.target);
      //     },
      //     move(event) {
      //       const oldX = +(event.target.getAttribute('posX') || 0);
      //       const oldY = +(event.target.getAttribute('posY') || 0);
      //       const xScale = +(event.target.getAttribute('xScale') || 1);
      //       const yScale = +(event.target.getAttribute('yScale') || 1);
      //       const newX = event.dx / xScale + oldX;
      //       const newY = event.dy / yScale + oldY;
      //       event.target.setAttribute('posX', newX);
      //       event.target.setAttribute('posy', newY);
      //       updateCssTransform(event.target, 'translate', `${newX}px, ${newY}px`);
      //     },
      //     end(event) {
      //       console.log('[FIELDS] Drag ended', event);
      //       // event.target.setAttribute('posX', 0);
      //       // event.target.setAttribute('posy', 0);
      //       // updateCssTransform(event.target, 'translate', `${0}px, ${0}px`);
      //     },
      //   },
      // });
    });
  }
  // handlePageRendered(e) {
  //   const pageInfo = e.detail as IPageRenderEvent;
  //   console.log('[SIGN] Page rendered', pageInfo);
  //
  //   const fields = this.fields.filter(field => field.page === pageInfo.renderedPage.pageNumber);
  //   console.log('[SIGN] Fields on page', fields);
  //   fields.forEach(field => this.renderField(field, pageInfo.renderedPage));
  //   // .map((field, index) => this.renderField(field, index));
  //   // this.pdfPageInfo = e.detail;
  // }

  render() {
    if (!this.envelope) {
      return <Host />;
    }

    const menuOptions = [
      {id: 'later', label: 'Finish Later'}, //
      {id: 'claim', label: 'Claim the Document', disabled: true},
      {id: 'decline', label: 'Decline to Sign'},
      {id: 'print', label: 'Print Without Signing'},
      {id: 'download', label: 'Download'},
    ];

    return (
      <Host class={{agreed: this.recipient?.agreed}}>
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
          <div class="inner">
            {(this.envelope?.documents || []).map(envelopeDocument => {
              const pages = [...(envelopeDocument?.pages || [])];
              pages.sort((a, b) => a.sequence - b.sequence);

              return (
                <Fragment>
                  {pages.map(page => (
                    <verdocs-document-page
                      pageImageUri={page.display_uri}
                      virtualWidth={612}
                      virtualHeight={792}
                      pageNumber={page.sequence}
                      onPageRendered={e => this.handlePageRendered(e)}
                      layers={[
                        {name: 'page', type: 'canvas'},
                        {name: 'controls', type: 'div'},
                      ]}
                    />
                  ))}
                </Fragment>
              );
            })}
          </div>
        </div>
      </Host>
    );
  }
}
