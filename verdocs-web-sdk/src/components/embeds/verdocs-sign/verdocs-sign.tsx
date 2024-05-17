import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {createInitials} from '@verdocs/js-sdk/Envelopes/Initials';
import {createSignature} from '@verdocs/js-sdk/Envelopes/Signatures';
import {isValidEmail, isValidPhone} from '@verdocs/js-sdk/Templates/Validators';
import {fullNameToInitials, integerSequence} from '@verdocs/js-sdk/Utils/Primitives';
import {Event, EventEmitter, Host, Fragment, Component, Prop, State, h} from '@stencil/core';
import {IEnvelopeField, IEnvelope, IRecipient, RecipientStates} from '@verdocs/js-sdk/Envelopes/Types';
import {envelopeRecipientAgree, envelopeRecipientDecline, envelopeRecipientSubmit} from '@verdocs/js-sdk/Envelopes/Recipients';
import {getEnvelope, updateEnvelopeFieldInitials, updateEnvelopeFieldSignature, uploadEnvelopeFieldAttachment} from '@verdocs/js-sdk/Envelopes/Envelopes';
import {getFieldId, renderDocumentField, saveAttachment, updateDocumentFieldValue} from '../../../utils/utils';
import {createTemplateFieldStoreFromEnvelope} from '../../../utils/TemplateFieldStore';
import {IDocumentPageInfo} from '../../../utils/Types';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

const inProgressMenuOptions = [
  {id: 'later', label: 'Finish Later'}, //
  // {id: 'claim', label: 'Claim the Document', disabled: true},
  {id: 'decline', label: 'Decline to Sign'},
  {id: 'print', label: 'Print Without Signing'},
  {id: 'download', label: 'Download'},
];

const doneMenuOptions = [
  {id: 'print', label: 'Print'},
  {id: 'download', label: 'Download'},
];

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
   * If set, (recommended), the host application should create a <DIV> element with a unique ID. When this
   * component renders, the header will be removed from its default location and placed in the target element.
   * This allows the parent application to more easily control its placement and scroll effects (e.g. "fixed").
   *
   * The movement of the header to the target container is not dynamic - it is performed only on the initial
   * render. Host applications should not conditionally render this container. If the header's visibility must
   * be externally controlled, use CSS display options to hide/show it instead.
   */
  @Prop() headerTargetId: string | null = null;

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
   * Event fired when the envelope is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) envelopeUpdated: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope; event: string}>;

  @State() envelope: IEnvelope | null = null;
  @State() roleNames: string[] = [];
  @State() sortedRecipients: IRecipient[] = [];
  @State() recipient: IRecipient | null = null;
  @State() signerToken = null;
  @State() hasSignature = false;
  @State() nextButtonLabel = 'Start';
  @State() nextSubmits = false;
  @State() errorMessage = '';
  @State() focusedField = '';
  @State() submitting = false;
  @State() isDone = false;
  @State() showDone = false;
  @State() showLoadError = false;
  @State() finishLater = false;
  @State() showFinishLater = false;
  @State() agreed = false;
  @State() documentsSingularPlural = 'document';

  recipientIndex: number = -1;

  componentWillLoad() {
    this.endpoint = new VerdocsEndpoint({sessionType: 'signing'});
  }

  async componentWillRender() {
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

      this.envelope = await getEnvelope(this.endpoint, this.envelopeId);

      createTemplateFieldStoreFromEnvelope(this.envelope);
      this.sortedRecipients = [...this.envelope.recipients];
      this.sortedRecipients.sort((a, b) => {
        return a.sequence === b.sequence ? a.order - b.order : a.sequence - b.sequence;
      });

      this.roleNames = this.sortedRecipients.map(r => r.role_name);

      if (this.envelope.documents.length > 0) {
        this.documentsSingularPlural = 'document(s)';
      }

      this.recipientIndex = this.roleNames.findIndex(roleName => roleName == this.roleId);
      if (this.recipientIndex > -1) {
        this.recipient = this.sortedRecipients[this.recipientIndex];
        this.agreed = this.recipient.agreed;
        console.log('[SIGN] Found our recipient in the envelope', this.recipientIndex, this.recipient);
      } else {
        console.log('[SIGN] Could not find our recipient record', this.roleId, this.sortedRecipients);
      }

      this.isDone = ['submitted', 'canceled', 'declined'].includes(this.recipient.status);

      this.checkRecipientFields();

      this.envelopeLoaded?.emit({endpoint: this.endpoint, envelope: this.envelope});
    } catch (e) {
      console.log('Error with signing session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      this.showLoadError = true;
    }
  }

  componentDidRender() {
    const headerTarget = this.headerTargetId ? document.getElementById(this.headerTargetId) : null;
    const headerEl = document.getElementById('verdocs-sign-header');
    if (headerTarget && headerEl) {
      console.log('[SIGN] Moving header');
      headerEl.remove();
      headerTarget.append(headerEl);
    }
  }

  handleClickAgree() {
    this.submitting = true;
    envelopeRecipientAgree(this.endpoint, this.envelopeId, this.roleId, true)
      .then(() => {
        this.nextButtonLabel = 'Next';
        this.recipient.agreed = true;
        this.submitting = false;
        this.agreed = true; // The server returns a recipient object but it's not "deep" so we track this locally
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'agreed'});
      })
      .catch(e => {
        console.log('Update failure', e);
        this.submitting = false;
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  async handleOptionSelected(e) {
    switch (e.detail.id) {
      case 'later':
        this.finishLater = true;
        this.showFinishLater = true;
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'later'});
        break;

      case 'claim':
        VerdocsToast('This feature will be available in an upcoming release.');
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'claimed'});
        break;

      case 'decline':
        {
          this.submitting = true;
          const declineResult = await envelopeRecipientDecline(this.endpoint, this.envelopeId, this.roleId);
          console.log('Decline result', declineResult);
          this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'declined'});
          this.submitting = false;
          this.isDone = true;
        }
        break;

      case 'print':
        window.print();
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'printed'});
        break;

      case 'download':
        saveAttachment(this.endpoint, this.envelope, this.envelope.envelope_document_id).catch(e => {
          console.log('Error downloading PDF', e);
        });
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'downloaded'});
        break;
    }
  }

  updateRecipientFieldValue(fieldName: string, updateResult: any) {
    console.log('[SIGN] updateRecipientFieldValue', fieldName);
    this.getRecipientFields().forEach(oldField => {
      if (oldField.name === fieldName) {
        oldField.settings = updateResult.settings;
        // TODO: When we break out other fields like value, update them here too
        updateDocumentFieldValue(oldField);
        this.checkRecipientFields();
      }
    });
  }

  saveFieldChange(fieldName: string, fields: Record<string, any>) {
    console.log('[SIGN] updateRecipientFieldValue', fieldName);
    Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, fieldName, fields) //
      .then(updateResult => this.updateRecipientFieldValue(fieldName, updateResult))
      .catch(e => {
        if (e.response?.status === 401 && e.response?.data?.error === 'jwt expired') {
          // TODO: Do we want to improve the instructions here?
          console.log('[SIGN] Signing session expired');
          this.errorMessage = 'Signing session expired. Please reload your browser to continue.';
        } else {
          console.log('[SIGN] Server error', e);
        }

        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  async handleFieldChange(field: IEnvelopeField, e: any) {
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
        // This can be caused by a focus-out event if the user clicks the field
        // after it's already filled in, then clicks something else like a textbox.
        // We don't visually indicate the focus, but it's still there.
        if (!e.detail) {
          return;
        }

        const initialsBlob = await (await fetch(e.detail)).blob();
        return createInitials(this.endpoint, 'initial', initialsBlob) //
          .then(async newInitials => {
            const updateResult = await updateEnvelopeFieldInitials(this.endpoint, this.envelopeId, field.name, newInitials.id);
            this.updateRecipientFieldValue(field.name, updateResult);
          });

      case 'signature':
        // This can be caused by a focus-out event if the user clicks the field
        // after it's already filled in, then clicks something else like a textbox.
        // We don't visually indicate the focus, but it's still there.
        if (!e.detail) {
          return;
        }

        const signatureBlob = await (await fetch(e.detail)).blob();
        return createSignature(this.endpoint, 'signature', signatureBlob) //
          .then(async newSignature => {
            console.log('Signature update result', newSignature);
            const updateResult = await updateEnvelopeFieldSignature(this.endpoint, this.envelopeId, field.name, newSignature.id);
            this.updateRecipientFieldValue(field.name, updateResult);
          })
          .catch(e => {
            console.warn('Error updating signature', e);
          });

      case 'date':
        const {date, formattedDate} = e.detail;
        if (formattedDate) {
          console.log('dt', {date, formattedDate});
          return this.saveFieldChange(field.name, {prepared: false, value: formattedDate});
        }
        break;

      case 'timestamp':
        console.log('Updating timestamp', {value, ts: e.target.getAttribute('timestamp')});
        break;

      default:
        console.log('Unhandled field update', {value, checked}, field);
        break;
    }
  }

  isFieldValid(field: IEnvelopeField) {
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
        // Patches the date picker to be forcibly removed if still showing during submission
        document.getElementById('air-datepicker-global-container')?.remove();

        this.submitting = true;
        const result = await envelopeRecipientSubmit(this.endpoint, this.envelopeId, this.roleId);
        console.log('[SIGN] Submitted successfully', result);
        this.recipient.status = 'submitted';
        this.showDone = true;
        this.isDone = true;

        // TODO: This is a temporary hack. After submitting, if we immediately show the View component it won't have re-renedered the
        //  pages yet with our submitted data.
        // setTimeout(() => {
        //   console.log('[SIGN] Reloading');
        //   window.location.reload();
        // }, 250);
      } catch (e) {
        console.log('[SIGN] Error submitting', e);
      }

      this.submitting = false;
      return;
    }

    // Find and focus the next incomplete required field
    const requiredFields = this.getRecipientFields().filter(field => field.required);

    requiredFields.sort((a, b) => {
      const aX = a.settings?.x || 0;
      const aY = a.settings?.y || 0;
      const bX = b.settings?.x || 0;
      const bY = b.settings?.y || 0;
      return bY !== aY ? bY - aY : bX - aX;
    });

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

  getRecipientFields() {
    return this.envelope.fields.filter(field => field.recipient_role === this.recipient.role_name);
  }

  // See if everything that "needs to be" filled in is, and all "fillable fields" are valid
  checkRecipientFields() {
    const invalidFields = this.getRecipientFields().filter(field => !this.isFieldValid(field));
    if (invalidFields.length < 1) {
      this.nextButtonLabel = 'Finish';
      if (!this.nextSubmits) {
        this.nextSubmits = true;
      }
    } else {
      console.log('[SIGN] c invalid fields', invalidFields);
      this.nextButtonLabel = 'Next';
      this.nextSubmits = false;
    }
  }

  attachFieldAttributes(pageInfo, field, el) {
    el.addEventListener('input', (e: any) => {
      console.log('[SIGN] onfieldInput', e.detail, e.target.value);
      // These field types don't emit fieldChange. Should we standardize on that? We don't tap "input" for fields like
      // text boxes because we'd be updating the field on every keystroke. We do those on blur which fires fieldChange.
      if (e.target.name.includes('checkbox_group') || e.target.name.includes('radio_button_group')) {
        this.handleFieldChange(field, e).finally(() => this.checkRecipientFields());
      } else {
        this.checkRecipientFields();
      }
    });
    el.addEventListener('attached', async (e: any) => {
      console.log('[SIGN] onAttached', e.detail, e.target.value);
      const r = await uploadEnvelopeFieldAttachment(this.endpoint, this.envelopeId, this.roleId, field.name, e.detail);
      console.log('upload result', r);
      this.checkRecipientFields();
    });
    el.addEventListener('removed', (e: any) => {
      console.log('[SIGN] onRemoved', e.detail, e.target.value);
    });
    el.addEventListener('focusout', e => this.handleFieldChange(field, e).finally(() => this.checkRecipientFields()));
    el.addEventListener('fieldChange', e => this.handleFieldChange(field, e).finally(() => this.checkRecipientFields()));

    el.setAttribute('templateid', this.envelope.template_id);
    el.setAttribute('fieldname', field.name);
    el.setAttribute('page', pageInfo.pageNumber);
    el.setAttribute('xScale', pageInfo.xScale);
    el.setAttribute('yScale', pageInfo.yScale);
    el.setAttribute('initials', this.recipient ? fullNameToInitials(this.recipient.full_name) : '');
    el.setAttribute('name', this.recipient?.full_name || '');
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;
    // const roleIndex = getRoleIndex(this.roleStore, this.recipient.role_name);
    // console.log(
    //   'hpr',
    //   this.recipient,
    //   this.envelope.fields.filter(field => field.recipient_role === this.recipient.role_name),
    // );
    const recipientFields = this.getRecipientFields().filter(field => field.page === pageInfo.pageNumber);
    // console.log('[SIGN] Page rendered, updating fields', {pageInfo, roleIndex, recipientFields});

    // First render the fields for the signer
    // Also show field placeholders for other signers who have yet to act
    // In template list in Beta, show second date being sorted on
    // Sign top to bottom left to right
    recipientFields
      .filter(field => field.page === pageInfo.pageNumber)
      .forEach(field => {
        const el = renderDocumentField(field, pageInfo, {disabled: false, editable: false, draggable: false, done: this.isDone});
        if (!el) {
          return;
        }

        if (Array.isArray(el)) {
          el.map(e => this.attachFieldAttributes(pageInfo, field, e));
        } else {
          this.attachFieldAttributes(pageInfo, field, el);
        }
      });

    // Now render the fields for other signers who have yet to act
    this.sortedRecipients
      .filter(
        r => r.role_name !== this.recipient.role_name && (r.status === RecipientStates.INVITED || r.status === RecipientStates.OPENED || r.status === RecipientStates.PENDING),
      )
      .forEach(() => {
        this.getRecipientFields()
          .filter(field => field.page === pageInfo.pageNumber)
          .forEach(field => {
            const el = renderDocumentField(field, pageInfo, {disabled: true, editable: false, draggable: false, done: this.isDone});
            if (!el) {
              return;
            }

            if (Array.isArray(el)) {
              el.map(e => this.attachFieldAttributes(pageInfo, field, e));
            } else {
              this.attachFieldAttributes(pageInfo, field, el);
            }
          });
      });

    this.checkRecipientFields();
  }

  render() {
    if (!this.envelope) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    if (this.isDone) {
      return (
        <Host class={{agreed: this.agreed}}>
          <verdocs-view endpoint={this.endpoint} envelopeId={this.envelopeId} onSdkError={e => this.sdkError?.emit(e.detail)} />

          {this.errorMessage && <verdocs-ok-dialog heading="Network Error" message={this.errorMessage} onNext={() => (this.errorMessage = '')} />}

          {this.showDone && (
            <verdocs-ok-dialog
              heading="You're Done!"
              message={`You can access the ${this.documentsSingularPlural} at any time by clicking on the link from the invitation email.<br /><br />After all recipients have completed their actions, you will receive an email with the document and envelope certificate attached.`}
              onNext={() => {
                this.showDone = false;
                this.isDone = true;
              }}
            />
          )}

          {this.submitting && (
            <div class="loading-indicator">
              <verdocs-loader />
            </div>
          )}
        </Host>
      );
    }

    return (
      <Host class={{agreed: this.agreed}}>
        <div id="verdocs-sign-header">
          <div class="inner">
            <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
            <div class="title">{this.envelope.name}</div>
            <div style={{flex: '1'}} />

            {this.agreed && !this.finishLater && <verdocs-button size="small" label={this.nextButtonLabel} disabled={!this.agreed} onClick={() => this.handleNext()} />}

            <div style={{marginLeft: '10px'}} />
            {this.agreed && (
              <verdocs-dropdown options={!this.isDone && !this.finishLater ? inProgressMenuOptions : doneMenuOptions} onOptionSelected={e => this.handleOptionSelected(e)} />
            )}
          </div>
        </div>

        <div class="document" style={{paddingTop: '15px'}}>
          {/*<div class="document" style={{paddingTop: this.headerTargetId ? '70px' : '15px'}}>*/}
          {(this.envelope.documents || []).map(envelopeDocument => {
            const pageNumbers = integerSequence(1, envelopeDocument.page_numbers);

            return (
              <Fragment>
                {pageNumbers.map(pageNumber => {
                  // In signing mode we show the original template page with all the recipient fields so we can show source formatting and
                  // where everything went. This is also a visual indicator when optional fields weren't filled in by previous actors, or
                  // future signers still need to act. Once we're "done" we flip to showing the envelope's documents which have the final
                  // field vales (so far) stamped into them.
                  // const templatePage = EnvelopeStore.template?.pages.find(p => p.sequence === page.sequence);
                  // TODO: Confirm that a pure page-number match is good enough to find the matching template page. We need to make sure
                  //  we either don't reset our page numbers for additional attachments, or add match-on identifiers to work around that.
                  // console.log('tp', templatePage, page);
                  return (
                    <verdocs-envelope-document-page
                      envelopeId={this.envelopeId}
                      documentId={envelopeDocument.id}
                      endpoint={this.endpoint}
                      virtualWidth={612}
                      virtualHeight={792}
                      pageNumber={pageNumber}
                      onPageRendered={e => this.handlePageRendered(e)}
                      type="filled"
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

        {this.showFinishLater && (
          <verdocs-ok-dialog
            heading="You've saved your document to finish later."
            message={`To complete the ${this.documentsSingularPlural}, use the link in the original email notification inviting you to review and finish the document.`}
            onNext={() => (this.showFinishLater = false)}
          />
        )}

        {this.errorMessage && <verdocs-ok-dialog heading="Network Error" message={this.errorMessage} onNext={() => (this.errorMessage = '')} />}

        {this.showDone && (
          <verdocs-ok-dialog
            heading="You're Done!"
            message={`You can access the ${this.documentsSingularPlural} at any time by clicking on the link from the invitation email.<br /><br />After all recipients have completed their actions, you will receive an email with the document and envelope certificate attached.`}
            onNext={() => {
              this.showDone = false;
              this.isDone = true;
            }}
          />
        )}

        {this.showLoadError && (
          <verdocs-ok-dialog
            heading="Error Loading Document"
            message={`Please check with the sender to ensure it has not been canceled, and try again later.`}
            buttonLabel="Retry"
            onNext={() => {
              this.showLoadError = false;
              window.location.reload();
            }}
          />
        )}

        {this.submitting && (
          <div class="loading-indicator">
            <verdocs-loader />
          </div>
        )}

        {!this.agreed && (
          <div class="cover">
            <div class="agree">
              <verdocs-checkbox name="agree" label="By checking this box, you:" onInput={() => this.handleClickAgree()} />
              <ul>
                <li>
                  Agree to use electronic records and signatures, and confirm you have read the{' '}
                  <a href="https://verdocs.com/en/electronic-record-signature-disclosure/" target="_blank">
                    Electronic Record and Signatures Disclosure
                  </a>
                  .
                </li>
                <li>
                  Agree to Verdocs{' '}
                  <a href="https://verdocs.com/en/eula" target="_blank">
                    End User License Agreement
                  </a>{' '}
                  and confirm you have read Verdocs'{' '}
                  <a href="https://verdocs.com/en/privacy-policy/" target="_blank">
                    Privacy Policy
                  </a>
                  .
                </li>
              </ul>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
