import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {createInitials} from '@verdocs/js-sdk/Envelopes/Initials';
import {createSignature} from '@verdocs/js-sdk/Envelopes/Signatures';
import {IDocumentField, IRecipient} from '@verdocs/js-sdk/Envelopes/Types';
import {updateRecipientStatus} from '@verdocs/js-sdk/Envelopes/Recipients';
import {isValidEmail, isValidPhone} from '@verdocs/js-sdk/Templates/Validators';
import {Event, EventEmitter, Host, Fragment, Component, Prop, State, h} from '@stencil/core';
import {updateEnvelopeFieldInitials, updateEnvelopeFieldSignature} from '@verdocs/js-sdk/Envelopes/Envelopes';
import {fullNameToInitials, getFieldId, getRoleIndex, renderDocumentField} from '../../../utils/utils';
import {getEnvelopeById} from '../../../utils/Envelopes';
import EnvelopeStore from '../../../utils/envelopeStore';
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
  // @State() envelope: IEnvelope | null = null;
  // @State() fields: IDocumentField[] = [];
  @State() hasSignature = false;
  @State() nextButtonLabel = 'Start';
  @State() errorMessage = '';
  @State() focusedField = '';

  @State() finishLater = false;
  @State() showFinishLater = false;

  recipientIndex: number = -1;
  fields: IDocumentField[] = [];

  componentWillLoad() {
    this.endpoint = new VerdocsEndpoint({sessionType: 'signing'});
  }

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

      await getEnvelopeById(this.endpoint, this.envelopeId);
      // const envelope = await Envelopes.getEnvelope(this.endpoint, this.envelopeId);
      // this.envelope = envelope;
      // console.log('[SIGN] Loaded envelope', envelope);

      this.recipientIndex = EnvelopeStore.envelope.recipients.findIndex(recipient => recipient.role_name == this.roleId);
      if (this.recipientIndex > -1) {
        this.recipient = EnvelopeStore.envelope.recipients[this.recipientIndex];
        this.fields = this.recipient.fields;
      }

      // TODO: Fix service to allow this?
      // const sigs = await getSignatures();
      // console.log('sigs', sigs);
    } catch (e) {
      console.log('Error with signing session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleClickAgree() {
    updateRecipientStatus(this.endpoint, this.envelopeId, this.roleId, 'update', {agreed: true})
      .then(r => {
        this.nextButtonLabel = 'Next';
        this.recipient = r;
      })
      .catch(e => {
        console.log('Update failure', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  async savePDF() {
    const fileName = `${EnvelopeStore.envelope.name} - ${EnvelopeStore.envelope.updated_at.split('T')[0]}.pdf`;
    const data = await Envelopes.getEnvelopeFile(this.endpoint, this.envelopeId, EnvelopeStore.envelope.envelope_document_id);

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

    xhr.open('GET', `data:application/pdf;base64,${data}`);
    xhr.send();
  }

  async handleOptionSelected(e) {
    switch (e.detail.id) {
      case 'later':
        this.finishLater = true;
        this.showFinishLater = true;
        // this.router.navigate([`view/sign/${this.envelopeId}/role/${this.roleName}/saved`]);
        // if (!window?.['STORYBOOK_ENV']) {
        //   window.alert('User intends to sign later.');
        // }
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

  saveFieldChange(fieldName: string, fields: Record<string, any>) {
    Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, fieldName, fields) //
      .catch(e => {
        if (e.response?.status === 401 && e.response?.data?.error === 'jwt expired') {
          // TODO: Do we want to improve the instructions here?
          console.log('[SIGN] Signing session expired');
          this.errorMessage = 'Signing session expired.';
        } else {
          console.log('[SIGN] Server error', e);
        }

        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  async handleFieldChange(field: IDocumentField, e: any) {
    console.log('fieldChange', field, e, e.target.value);
    const {value, checked} = e.target;

    switch (field.type) {
      case 'textbox':
        return this.saveFieldChange(field.name, {prepared: false, value});

      case 'checkbox_group': {
        const options = field.settings.options.map(option => ({id: option.id, checked: e.target.checked}));
        return this.saveFieldChange(field.name, {prepared: false, value: {options}});
      }

      case 'radio_button_group': {
        const options = field.settings.options.map(option => ({id: option.id, selected: e.target.value === option.id}));
        return this.saveFieldChange(field.name, {prepared: false, value: {options}});
      }

      case 'dropdown':
        return this.saveFieldChange(field.name, {prepared: false, value: e.detail});

      case 'initial':
        const initialsBlob = await (await fetch(e.detail)).blob();
        return createInitials(this.endpoint, 'initial', initialsBlob) //
          .then(newInitials => {
            console.log('New initials', field.name, newInitials);
            updateEnvelopeFieldInitials(this.endpoint, this.envelopeId, field.name, newInitials.id);
          });

      case 'signature':
        const signatureBlob = await (await fetch(e.detail)).blob();
        return createSignature(this.endpoint, 'signature', signatureBlob) //
          .then(newSignature => {
            console.log('New sign', field.name, newSignature);
            updateEnvelopeFieldSignature(this.endpoint, this.envelopeId, field.name, newSignature.id);
          });

      case 'date':
        const iso = e.target.getAttribute('iso');
        return this.saveFieldChange(field.name, {prepared: false, value: iso});

      default:
        console.log('Unhandled field update', {value, checked}, field);
        break;
    }
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
        return !!field.settings?.base64;

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

  handleNext() {
    // Find and focus the next incomplete required field
    const requiredFields = this.fields.filter(field => field.required);
    const focusedIndex = requiredFields.findIndex(field => field.name === this.focusedField);

    let nextFocusedIndex = focusedIndex + 1;
    if (nextFocusedIndex >= requiredFields.length) {
      nextFocusedIndex = 0;
    }

    let nextRequiredField = requiredFields[nextFocusedIndex];

    // Skip signature and initial fields that are already filled in. We have to count our "skips" just in case, to avoid infinite loops.
    let skips = 0;
    if (skips < requiredFields.length && ['signature', 'initial'].includes(nextRequiredField.type) && nextRequiredField.settings?.result === 'signed') {
      skips++;
      nextFocusedIndex++;
      if (nextFocusedIndex >= requiredFields.length) {
        nextFocusedIndex = 0;
      }
      nextRequiredField = requiredFields[nextFocusedIndex];
    }

    if (skips >= requiredFields.length) {
      nextRequiredField = null;
    }

    if (nextRequiredField) {
      const id = getFieldId(nextRequiredField);
      const el = document.getElementById(id) as any;
      el?.focusField();
      this.focusedField = nextRequiredField.name;
    }
  }

  attachFieldAttributes(pageInfo, field, roleIndex, el) {
    el.addEventListener('input', e => this.handleFieldChange(field, e));
    el.addEventListener('fieldChange', e => this.handleFieldChange(field, e));

    el.setAttribute('roleindex', roleIndex);
    el.setAttribute('xScale', pageInfo.xScale);
    el.setAttribute('yScale', pageInfo.yScale);
    el.setAttribute('initials', this.recipient ? fullNameToInitials(this.recipient.full_name) : '');
    el.setAttribute('name', this.recipient?.full_name || '');
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;
    console.log('[SIGN] Page rendered, adding fields', pageInfo);

    console.log('recipient', this.recipient);
    const roleIndex = getRoleIndex(EnvelopeStore.roleNames, this.recipient.role_name);
    const recipientFields = this.recipient.fields.filter(field => field.page === pageInfo.pageNumber);
    recipientFields.forEach(field => {
      const el = renderDocumentField(field, pageInfo, roleIndex, {disabled: false, editable: false, draggable: false});
      if (!el) {
        return;
      }

      if (Array.isArray(el)) {
        el.map(e => this.attachFieldAttributes(pageInfo, field, roleIndex, e));
      } else {
        this.attachFieldAttributes(pageInfo, field, roleIndex, el);
      }

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

    EnvelopeStore.envelope.recipients
      .filter(recipient => recipient.role_name !== this.recipient.role_name)
      .map(otherRecipient => {
        const otherRoleIndex = getRoleIndex(EnvelopeStore.roleNames, otherRecipient.role_name);
        console.log('Rendering fields for other recipient', otherRoleIndex, otherRecipient);
        const recipientFields = otherRecipient.fields.filter(field => field.page === pageInfo.pageNumber);
        // const fields = this.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
        console.log('[SIGN] Fields on page', recipientFields);
        recipientFields.forEach(field => {
          const el = renderDocumentField(field, pageInfo, otherRoleIndex, {disabled: true, editable: false, draggable: false});
          if (!el) {
            return;
          }

          el.setAttribute('roleindex', otherRoleIndex);
          el.setAttribute('xScale', pageInfo.xScale);
          el.setAttribute('yScale', pageInfo.yScale);
        });
      });
  }

  render() {
    if (EnvelopeStore.loading || !EnvelopeStore.envelope) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    const menuOptions = [
      {id: 'later', label: 'Finish Later'}, //
      {id: 'claim', label: 'Claim the Document', disabled: true},
      {id: 'decline', label: 'Decline to Sign'},
      {id: 'print', label: 'Print Without Signing', disabled: true},
      {id: 'download', label: 'Download'},
    ];

    return (
      <Host class={{agreed: this.recipient?.agreed}}>
        {!this.finishLater && (
          <div class="intro">
            <div class="inner">Please review and act on these documents.</div>
          </div>
        )}

        <div class="header">
          <div class="inner">
            {!this.finishLater && (
              <div class="toolbar">
                <div class="tools">
                  <verdocs-dropdown options={menuOptions} onOptionSelected={e => this.handleOptionSelected(e)} />

                  {!this.recipient?.agreed ? (
                    <div class="agree">
                      <verdocs-checkbox name="agree" label="I agree to use electronic records and signatures." onInput={() => this.handleClickAgree()} />
                    </div>
                  ) : (
                    <div style={{flex: '1'}} />
                  )}
                  <verdocs-button size="small" label={this.nextButtonLabel} disabled={!this.recipient?.agreed} onClick={() => this.handleNext()} />
                </div>
              </div>
            )}
          </div>
        </div>

        {!this.recipient?.agreed ? <div class="cover" /> : <div style={{display: 'none'}} />}

        <div class="document">
          {(EnvelopeStore.envelope.documents || []).map(envelopeDocument => {
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

        {this.showFinishLater && (
          <verdocs-ok-dialog
            heading="You've saved your document to finish later."
            message="To complete the document, use the link in the original email notification inviting you to review and finish the document."
            onNext={() => (this.showFinishLater = false)}
          />
        )}

        {this.errorMessage && <verdocs-ok-dialog heading="Network Error" message={this.errorMessage} onNext={() => (this.errorMessage = '')} />}
      </Host>
    );
  }
}
