import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {createInitials} from '@verdocs/js-sdk/Envelopes/Initials';
import {createSignature} from '@verdocs/js-sdk/Envelopes/Signatures';
import {IDocumentField, IEnvelope, IRecipient} from '@verdocs/js-sdk/Envelopes/Types';
import {envelopeRecipientAgree, envelopeRecipientDecline, envelopeRecipientSubmit} from '@verdocs/js-sdk/Envelopes/Recipients';
import {isValidEmail, isValidPhone} from '@verdocs/js-sdk/Templates/Validators';
import {Event, EventEmitter, Host, Fragment, Component, Prop, State, h} from '@stencil/core';
import {updateEnvelopeFieldInitials, updateEnvelopeFieldSignature} from '@verdocs/js-sdk/Envelopes/Envelopes';
import {fullNameToInitials, getFieldId, getRoleIndex, renderDocumentField, savePDF, updateDocumentFieldValue} from '../../../utils/utils';
import {getEnvelopeById} from '../../../utils/Envelopes';
import EnvelopeStore from '../../../utils/envelopeStore';
import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';

const PrintIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"></path></svg>`;

const DownloadIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path></svg>`;

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
   * Event fired when the envelope is updated in any way.
   */
  @Event({composed: true}) envelopeLoaded: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope}>;

  /**
   * Event fired when the envelope is updated in any way.
   */
  @Event({composed: true}) envelopeUpdated: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope; event: string}>;

  @State() recipient: IRecipient | null = null;
  @State() signerToken = null;
  @State() hasSignature = false;
  @State() nextButtonLabel = 'Start';
  @State() nextSubmits = false;
  @State() errorMessage = '';
  @State() focusedField = '';
  @State() isDone = false;
  @State() showDone = false;

  @State() finishLater = false;
  @State() showFinishLater = false;
  @State() agreed = false;

  recipientIndex: number = -1;

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
      console.log('[SIGN] We are recipient', this.recipient);
      this.signerToken = signerToken;
      this.endpoint.setToken(signerToken);

      if (this.agreed) {
        this.nextButtonLabel = 'Next';
      }

      await getEnvelopeById(this.endpoint, this.envelopeId);

      this.recipientIndex = EnvelopeStore.envelope.recipients.findIndex(recipient => recipient.role_name == this.roleId);
      if (this.recipientIndex > -1) {
        this.recipient = EnvelopeStore.envelope.recipients[this.recipientIndex];
        this.agreed = this.recipient.agreed;
        console.log('[SIGN] Found our recipient in the envelope', this.recipientIndex, this.recipient);
      } else {
        console.log('[SIGN] Could not find our recipient record', this.roleId, EnvelopeStore.envelope.recipients);
      }

      this.isDone = ['submitted', 'canceled', 'declined'].includes(this.recipient.status);

      // TODO: Fix service to allow this?
      // const sigs = await getSignatures();
      // console.log('sigs', sigs);

      this.envelopeLoaded?.emit({endpoint: this.endpoint, envelope: EnvelopeStore.envelope});
    } catch (e) {
      console.log('Error with signing session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleClickAgree() {
    envelopeRecipientAgree(this.endpoint, this.envelopeId, this.roleId, true)
      .then(() => {
        this.nextButtonLabel = 'Next';
        this.agreed = true; // The server returns a recipient object but it's not "deep" so we track this locally
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: EnvelopeStore.envelope, event: 'agreed'});
      })
      .catch(e => {
        console.log('Update failure', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  async handleOptionSelected(e) {
    switch (e.detail.id) {
      case 'later':
        this.finishLater = true;
        this.showFinishLater = true;
        // this.router.navigate([`view/sign/${this.envelopeId}/role/${this.roleName}/saved`]);
        break;
      case 'claim':
        window.alert('This feature will be available in an upcoming release.');
        break;
      case 'decline':
        {
          const declineResult = await envelopeRecipientDecline(this.endpoint, this.envelopeId, this.roleId);
          console.log('Decline result', declineResult);
          this.isDone = true;
        }
        break;
      case 'print':
        window.print();
        break;
      case 'download':
        savePDF(this.endpoint, EnvelopeStore.envelope, EnvelopeStore.envelope.envelope_document_id).catch(() => {});
        break;
    }
  }

  updateRecipientFieldValue(fieldName: string, updateResult: any) {
    this.recipient.fields.forEach(oldField => {
      if (oldField.name === fieldName) {
        oldField.settings = updateResult.settings;
        // TODO: When we break out other fields like value, update them here too
        updateDocumentFieldValue(oldField);
      }
    });
  }

  saveFieldChange(fieldName: string, fields: Record<string, any>) {
    Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, fieldName, fields) //
      .then(updateResult => {
        this.updateRecipientFieldValue(fieldName, updateResult);
      })
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
          .then(async newInitials => {
            const updateResult = await updateEnvelopeFieldInitials(this.endpoint, this.envelopeId, field.name, newInitials.id);
            this.updateRecipientFieldValue(field.name, updateResult);
          });

      case 'signature':
        const signatureBlob = await (await fetch(e.detail)).blob();
        return createSignature(this.endpoint, 'signature', signatureBlob) //
          .then(async newSignature => {
            const updateResult = await updateEnvelopeFieldSignature(this.endpoint, this.envelopeId, field.name, newSignature.id);
            this.updateRecipientFieldValue(field.name, updateResult);
          });

      case 'date':
        const iso = e.target.getAttribute('iso');
        return this.saveFieldChange(field.name, {prepared: false, value: iso});

      case 'timestamp':
        console.log('Updating timestamp', {value, ts: e.target.getAttribute('timestamp')});
        break;

      default:
        console.log('Unhandled field update', {value, checked}, field);
        break;
    }
  }

  isFieldValid(field: IDocumentField) {
    const {required = false} = field;
    const {result = '', value = '', base64 = ''} = field.settings || {};
    switch (field.type) {
      case 'textbox':
        switch (field.settings?.validator || '') {
          case 'email':
            return isValidEmail(result);
          case 'phone':
            return isValidPhone(result);
          default:
            return !required || result !== '';
        }

      case 'signature':
      case 'initial':
        return !required || base64 !== '';

      // Timestamp fields get automatically filled when the envelope is submitted.
      case 'timestamp':
        return true;

      case 'textarea':
      case 'date':
      case 'attachment':
        return !required || result !== '';

      case 'dropdown':
        return !required || value !== '';

      case 'checkbox_group':
        const checkedCount = (field.settings?.options?.filter(option => option.checked) || []).length;
        return !required || (checkedCount >= (field.settings?.minimum_checked || 0) && checkedCount <= (field.settings?.maximum_checked || 999));

      case 'radio_button_group':
        return !required || (field.settings?.options?.filter(option => option.selected) || []).length > 0;
      // TODO
      // case 'checkbox':
      //   return <verdocs-field-checkbox style={style} value={result || ''} id={id} />;
      // case 'payment':
      //   return <verdocs-field-payment style={style} field={field} id={id} />;
      default:
        return false;
    }
  }

  async handleNext() {
    if (this.nextSubmits) {
      try {
        const result = await envelopeRecipientSubmit(this.endpoint, this.envelopeId, this.roleId);
        console.log('[SIGN] Submitted successfully', result);
        this.showDone = true;
        this.isDone = true;
      } catch (e) {
        console.log('Error submitting', e);
      }

      return;
    }

    // Find and focus the next incomplete required field
    const requiredFields = this.recipient.fields.filter(field => field.required);
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

  // See if everything that "needs to be" filled in is, and all "fillable fields" are valid
  checkRecipientFields() {
    const invalidFields = this.recipient.fields.filter(field => !this.isFieldValid(field));
    if (invalidFields.length < 1) {
      this.nextButtonLabel = 'Finish';
      this.nextSubmits = true;
    } else {
      console.log('[SIGN] Remaining invalid fields', invalidFields);
      this.nextButtonLabel = 'Next';
      this.nextSubmits = false;
    }
  }

  attachFieldAttributes(pageInfo, field, roleIndex, el) {
    el.addEventListener('input', e => this.handleFieldChange(field, e).finally(() => this.checkRecipientFields()));
    el.addEventListener('blur', () => this.checkRecipientFields());
    el.addEventListener('fieldChange', e => this.handleFieldChange(field, e).finally(() => this.checkRecipientFields()));

    el.setAttribute('roleindex', roleIndex);
    el.setAttribute('xScale', pageInfo.xScale);
    el.setAttribute('yScale', pageInfo.yScale);
    el.setAttribute('initials', this.recipient ? fullNameToInitials(this.recipient.full_name) : '');
    el.setAttribute('name', this.recipient?.full_name || '');
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;
    const roleIndex = getRoleIndex(EnvelopeStore.roleNames, this.recipient.role_name);
    const recipientFields = this.recipient.fields.filter(field => field.page === pageInfo.pageNumber);
    console.log('[SIGN] Page rendered, updating fields', {pageInfo, roleIndex, recipientFields});

    recipientFields.forEach(field => {
      const el = renderDocumentField(field, pageInfo, roleIndex, {disabled: false, editable: false, draggable: false, done: this.isDone});
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

    // Render fields for "the other" recipients
    EnvelopeStore.envelope.recipients
      .filter(recipient => recipient.role_name !== this.recipient.role_name)
      .forEach(otherRecipient => {
        const otherRoleIndex = getRoleIndex(EnvelopeStore.roleNames, otherRecipient.role_name);
        const recipientFields = otherRecipient.fields.filter(field => field.page === pageInfo.pageNumber);

        // We don't render other recipients' fields if they've already acted, because those values are now stamped into the document page.
        // TODO: Do we want to render alternate treatments for recipients who have declined (red boxes?) and/or if the envelope is cancelled?
        // TODO: When doing server-side rendering we probably want to "stamp" values into the rendered PDF only once the recipient is done
        //  acting. Do this once vSign is in Production.
        // TODO: Changed tacks here. During signing we show the template PDFs and everybody's fields, filled in or no. When done, we switch
        //  to showing the envelope PDFs with stamped-in values. Confirm this is a good approach.
        // if (!['submitted', 'signed'].includes(otherRecipient.status)) {
        recipientFields.forEach(field => {
          const el = renderDocumentField(field, pageInfo, otherRoleIndex, {
            disabled: true,
            editable: false,
            draggable: false,
            done: this.isDone,
          });
          if (!el) {
            return;
          }

          // TODO: Research why this occurs. There are cases when we're getting "el.setAttribute is not a function"
          if (el.setAttribute) {
            el.setAttribute('roleindex', otherRoleIndex);
            el.setAttribute('xScale', pageInfo.xScale);
            el.setAttribute('yScale', pageInfo.yScale);
          }
        });
        // }
      });

    this.checkRecipientFields();
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
      // {id: 'claim', label: 'Claim the Document', disabled: true},
      {id: 'decline', label: 'Decline to Sign'},
      {id: 'print', label: 'Print Without Signing', disabled: true},
      {id: 'download', label: 'Download'},
    ];

    return (
      <Host class={{agreed: this.agreed}}>
        {!this.isDone && !this.finishLater && <div class="intro">Please review and act on these documents.</div>}

        {!this.isDone && (
          <div class="header">
            {!this.isDone && !this.finishLater && <verdocs-dropdown options={menuOptions} onOptionSelected={e => this.handleOptionSelected(e)} />}

            {!this.agreed ? (
              <div class="agree">
                <verdocs-checkbox name="agree" label="I agree to use electronic records and signatures." onInput={() => this.handleClickAgree()} />
              </div>
            ) : (
              <Fragment>
                <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
                <div class="title">{EnvelopeStore.envelope.name}</div>
                <div style={{flex: '1'}} />
                <div innerHTML={PrintIcon} style={{width: '24px', height: '24px', fill: '#fff', cursor: 'pointer'}} onClick={() => window.print()} />
                <div
                  innerHTML={DownloadIcon}
                  style={{width: '24px', height: '24px', fill: '#fff', cursor: 'pointer', margin: '0 16px', maginRight: '30px'}}
                  onClick={() => savePDF(this.endpoint, EnvelopeStore.envelope, EnvelopeStore.envelope.envelope_document_id).catch(() => {})}
                />
              </Fragment>
            )}

            {!this.isDone && !this.finishLater && <verdocs-button size="small" label={this.nextButtonLabel} disabled={!this.agreed} onClick={() => this.handleNext()} />}
          </div>
        )}

        {!this.isDone && !this.agreed ? <div class="cover" /> : <div style={{display: 'none'}} />}

        {this.isDone ? (
          // <div>test</div>
          <verdocs-view endpoint={this.endpoint} envelopeId={this.envelopeId} onSdkError={e => this.sdkError?.emit(e.detail)} />
        ) : (
          <div class="document">
            {(EnvelopeStore.envelope.documents || []).map(envelopeDocument => {
              const pages = [...(envelopeDocument?.pages || [])];
              pages.sort((a, b) => a.sequence - b.sequence);

              return (
                <Fragment>
                  {pages.map(page => {
                    // In signing mode we show the original template page with all the recipient fields so we can show source formatting and
                    // where everything went. This is also a visual indicator when optional fields weren't filled in by previous actors, or
                    // future signers still need to act. Once we're "done" we flip to showing the envelope's documents which have the final
                    // field vales (so far) stamped into them.
                    const templatePage = EnvelopeStore.template?.pages.find(p => p.sequence === page.sequence);
                    // TODO: Confirm that a pure page-number match is good enough to find the matching template page. We need to make sure
                    //  we either don't reset our page numbers for additional attachments, or add match-on identifiers to work around that.
                    // console.log('tp', templatePage, page);
                    return (
                      <verdocs-document-page
                        pageImageUri={templatePage?.display_uri || page.display_uri}
                        virtualWidth={612}
                        virtualHeight={792}
                        pageNumber={page.sequence}
                        onPageRendered={e => this.handlePageRendered(e)}
                        layers={[
                          {name: 'page', type: 'canvas'},
                          {name: 'controls', type: 'div'},
                        ]}
                      />
                    );
                  })}
                </Fragment>
              );
            })}
          </div>
        )}

        {this.showFinishLater && (
          <verdocs-ok-dialog
            heading="You've saved your document to finish later."
            message="To complete the document, use the link in the original email notification inviting you to review and finish the document."
            onNext={() => (this.showFinishLater = false)}
          />
        )}

        {this.errorMessage && <verdocs-ok-dialog heading="Network Error" message={this.errorMessage} onNext={() => (this.errorMessage = '')} />}
        {this.showDone && (
          <verdocs-ok-dialog
            heading="You're Done!"
            message="You can access the Verdoc at any time by clicking on the link from the invitation email.<br /><br />After all recipients have completed their actions, you will receive an email with the document and envelope certificate attached."
            onNext={() => (this.showDone = false)}
          />
        )}
      </Host>
    );
  }
}
