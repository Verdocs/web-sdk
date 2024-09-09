import {Event, EventEmitter, Host, Fragment, Component, Prop, State, h} from '@stencil/core';
import {fullNameToInitials, startSigningSession, IEnvelope, IEnvelopeField} from '@verdocs/js-sdk';
import {integerSequence, IRecipient, isValidEmail, isValidPhone, updateEnvelopeFieldInitials} from '@verdocs/js-sdk';
import {updateEnvelopeFieldSignature, uploadEnvelopeFieldAttachment, VerdocsEndpoint, updateEnvelopeField} from '@verdocs/js-sdk';
import {createInitials, createSignature, envelopeRecipientAgree, envelopeRecipientDecline, envelopeRecipientSubmit, formatFullName} from '@verdocs/js-sdk';
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
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop({mutable: true}) endpoint: VerdocsEndpoint = null;

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
    if (!this.endpoint) {
      console.log('[SIGN] Creating signing endpoint');
      this.endpoint = new VerdocsEndpoint({sessionType: 'signing'});
    }
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

      const {envelope, recipient} = await startSigningSession(this.endpoint, this.envelopeId, this.roleId, this.inviteCode);
      console.log(`[SIGN] Loaded signing session`, envelope, recipient);

      this.recipient = recipient;
      this.envelope = envelope;

      if (this.agreed) {
        this.nextButtonLabel = 'Next';
      }

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
      } else {
        console.warn('[SIGN] Could not find our recipient record', this.roleId, this.sortedRecipients);
      }

      this.isDone = ['submitted', 'canceled', 'declined'].includes(this.recipient.status);

      this.checkRecipientFields();

      this.envelopeLoaded?.emit({endpoint: this.endpoint, envelope: this.envelope});
    } catch (e) {
      console.log('[SIGN] Error with signing session', e);
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
        console.log('[SIGN] Update failure', e);
        this.submitting = false;
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  async handleOptionSelected(e: any) {
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
          console.log('[SIGN] Decline result', declineResult);
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
        {
          const firstDoc = this.envelope.documents.find(doc => doc.type === 'attachment');
          if (firstDoc) {
            saveAttachment(this.endpoint, this.envelope, firstDoc.id).catch(e => {
              console.log('[SIGN] Error downloading PDF', e);
            });
            this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'downloaded'});
          }
        }
        break;
    }
  }

  updateRecipientFieldValue(fieldName: string, updateResult: any) {
    console.log('[SIGN] updateRecipientFieldValue', fieldName);
    this.getRecipientFields().forEach(oldField => {
      if (oldField.name === fieldName) {
        oldField.value = updateResult.value;
        oldField.settings = updateResult.settings;
        updateDocumentFieldValue(oldField);
        this.checkRecipientFields();
      }
    });
  }

  saveFieldChange(fieldName: string, fields: Record<string, any>) {
    console.log('[SIGN] updateRecipientFieldValue', fieldName);
    updateEnvelopeField(this.endpoint, this.envelopeId, fieldName, fields) //
      .then(updateResult => this.updateRecipientFieldValue(fieldName, updateResult))
      .catch(e => {
        if (e.response?.status === 401 && e.response?.data?.error === 'jwt expired') {
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

    switch (field.type as any) {
      case 'textbox':
        return this.saveFieldChange(field.name, {prepared: false, value});

      case 'checkbox': {
        return this.saveFieldChange(field.name, {prepared: false, value: e.target.checked});
      }

      case 'radio': {
        return this.saveFieldChange(field.name, {prepared: false, value: e.target.checked});
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
            console.warn('[SIGN] Error updating signature', e);
          });

      case 'date':
        const {formattedDate} = e.detail;
        if (formattedDate) {
          return this.saveFieldChange(field.name, {prepared: false, value: formattedDate});
        }
        break;

      case 'timestamp':
        console.log('[SIGN] Updating timestamp', {value, ts: e.target.getAttribute('timestamp')});
        break;

      default:
        console.log('[SIGN] Unhandled field update', {value, checked}, field);
        break;
    }
  }

  isFieldFilled(field: IEnvelopeField) {
    const {value = ''} = field;
    switch (field.type as any) {
      case 'textbox':
        switch (field.validator || '') {
          case 'email':
            return isValidEmail(value);
          case 'phone':
            return isValidPhone(value);
          default:
            return value !== '';
        }

      case 'signature':
        return value === 'signed';

      case 'initial':
        return value === 'initialed';

      // Timestamp fields get automatically filled when the envelope is submitted.
      case 'timestamp':
        return true;

      case 'textarea':
      case 'date':
        return value !== '';

      case 'attachment':
        return value === 'attached';

      case 'dropdown':
        return value !== '';

      case 'checkbox':
        return value === 'true';

      case 'radio':
        if (!!field.group) {
          return this.getRecipientFields()
            .filter(f => f.group === field.group)
            .some(field => field.value === 'true');
        }

        return field.value === 'true';

      default:
        return false;
    }
  }

  isFieldValid(field: IEnvelopeField) {
    return !field.required || this.isFieldFilled(field);
  }

  getSortedFillableFields() {
    const recipientFields = this.getRecipientFields().filter(field => field.type !== 'timestamp');

    recipientFields.sort((a, b) => {
      const aX = a.x || 0;
      const aY = a.y || 0;
      const bX = b.x || 0;
      const bY = b.y || 0;
      // NOTE: Logic looks a little strange X vs Y. It's because we go top down,
      // left to right. But Y coordinates are inverted in PDFs. The reason for
      // the division is because no human makes perfect templates and frequently
      // two fields on the "same line" will be slightly offset vertically.
      const divaY = Math.floor(aY / 5);
      const divbY = Math.floor(bY / 5);
      return divbY !== divaY ? divbY - divaY : aX - bX;
    });

    return recipientFields;
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
      } catch (e) {
        console.log('[SIGN] Error submitting', e);
      }

      this.submitting = false;
      return;
    }

    // Find and focus the next incomplete` field (that is fillable)
    const emptyFields = this.getSortedFillableFields().filter(field => !this.isFieldFilled(field));

    emptyFields.sort((a, b) => {
      const aX = a.x || 0;
      const aY = a.y || 0;
      const bX = b.x || 0;
      const bY = b.y || 0;
      // NOTE: Logic looks a little strange X vs Y. It's because we go top down,
      // left to right. But Y coordinates are inverted in PDFs. The reason for
      // the division is because no human makes perfect templates and frequently
      // two fields on the "same line" will be slightly offset vertically.
      const divaY = Math.floor(aY / 5);
      const divbY = Math.floor(bY / 5);
      return divbY !== divaY ? divbY - divaY : aX - bX;
    });

    const focusedIndex = emptyFields.findIndex(field => field.name === this.focusedField);
    let nextFocusedIndex = focusedIndex + 1;
    if (nextFocusedIndex >= emptyFields.length) {
      nextFocusedIndex = 0;
    }

    let nextRequiredField = emptyFields[nextFocusedIndex];

    // Skip signature and initial fields that are already filled in. We have to count our "skips" just in case, to avoid infinite loops.
    let skips = 0;
    if (skips < emptyFields.length && ['signature', 'initial'].includes(nextRequiredField.type) && nextRequiredField.settings?.result === 'signed') {
      skips++;
      nextFocusedIndex++;
      if (nextFocusedIndex >= emptyFields.length) {
        nextFocusedIndex = 0;
      }
      nextRequiredField = emptyFields[nextFocusedIndex];
    }

    if (skips >= emptyFields.length) {
      nextRequiredField = null;
    }

    if (nextRequiredField) {
      const id = getFieldId(nextRequiredField);
      const el = document.getElementById(id) as any;
      el?.focusField();
      el?.scrollTo({behavior: 'smooth', top: 0});
      this.focusedField = nextRequiredField.name;
    }
  }

  getRecipientFields() {
    return this.envelope.fields.filter(field => field.role_name === this.recipient.role_name);
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
      console.log('[SIGN] Invalid fields remaining', invalidFields);
      this.nextButtonLabel = 'Next';
      this.nextSubmits = false;
    }
  }

  attachFieldAttributes(pageInfo, field, el) {
    el.addEventListener('input', (e: any) => {
      // console.log('[SIGN] onfieldInput', e.detail, e.target.value);
      // These field types don't emit fieldChange. Should we standardize on that? We don't tap "input" for fields like
      // text boxes because we'd be updating the field on every keystroke. We do those on blur which fires fieldChange.
      console.log('onInput', e.target.type, e.target.name);
      if (e.target.type === 'radio' || e.target.type === 'checkbox') {
        // if (e.target.type === 'radio' || e.target.name.includes('date') || e.target.name.includes('checkbox')) {
        this.handleFieldChange(field, e).finally(() => this.checkRecipientFields());
      } else {
        this.checkRecipientFields();
      }
    });
    el.addEventListener('attached', async (e: any) => {
      console.log('[SIGN] onAttached', e.detail, e.target.value);
      const r = await uploadEnvelopeFieldAttachment(this.endpoint, this.envelopeId, field.name, e.detail);
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

    const fullName = formatFullName(this.recipient);
    el.setAttribute('initials', fullNameToInitials(fullName));
    el.setAttribute('name', fullName);
  }

  handlePageRendered(e: any) {
    const pageInfo = e.detail as IDocumentPageInfo;

    // NOTE: We don't filter on pageNumber here because we need the position in the
    // entire list to set the tabIndex.
    const recipientFields = this.getSortedFillableFields();
    console.log('Recipient fields', recipientFields);
    // this.getRecipientFields().filter(field => field.page === pageInfo.pageNumber);

    // First render the fields for the signer
    // Also show field placeholders for other signers who have yet to act
    // In template list in Beta, show second date being sorted on
    // Sign top to bottom left to right
    recipientFields.forEach((field, tabIndex) => {
      if (field.page !== pageInfo.pageNumber) {
        return;
      }

      const el = renderDocumentField(field, pageInfo, {disabled: false, editable: false, draggable: false, done: this.isDone}, tabIndex);
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
      .filter(r => r.role_name !== this.recipient.role_name && (r.status === 'invited' || r.status === 'opened' || r.status === 'pending'))
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

        {this.agreed && (
          <div class="document" style={{paddingTop: '15px'}}>
            {(this.envelope.documents || []).map(envelopeDocument => {
              const pageNumbers = integerSequence(1, envelopeDocument.pages);

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
        )}

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
