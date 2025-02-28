import {Event, EventEmitter, Host, Fragment, Component, Prop, State, h} from '@stencil/core';
import {getEnvelope, integerSequence, isValidEmail, isValidPhone, updateEnvelopeFieldInitials} from '@verdocs/js-sdk';
import {fullNameToInitials, startSigningSession, deleteEnvelopeFieldAttachment, formatFullName} from '@verdocs/js-sdk';
import {authenticateSigner, IEnvelope, IEnvelopeField, IRecipient, TAuthenticateRecipientRequest} from '@verdocs/js-sdk';
import {updateEnvelopeFieldSignature, uploadEnvelopeFieldAttachment, VerdocsEndpoint, TRecipientAuthMethod} from '@verdocs/js-sdk';
import {createInitials, createSignature, envelopeRecipientAgree, envelopeRecipientDecline, envelopeRecipientSubmit} from '@verdocs/js-sdk';
import {getFieldId, renderDocumentField, saveAttachment, updateDocumentFieldValue} from '../../../utils/utils';
import {updateEnvelopeField, sortFields} from '@verdocs/js-sdk';
import {IDocumentPageInfo} from '../../../utils/Types';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

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
  @Prop({reflect: true}) envelopeId: string | null = null;

  /**
   * The ID of the role that will be signing e.g. 'Recipient 1'
   */
  @Prop({reflect: true}) roleId: string | null = null;

  /**
   * The invite code for the signer.
   */
  @Prop({reflect: true}) inviteCode: string | null = null;

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

  // @State() roleNames: string[] = [];
  // @State() sortedRecipients: IRecipient[] = [];
  @State() recipient: IRecipient | null = null;
  @State() hasSignature = false;
  @State() nextButtonLabel = 'Start';
  @State() nextSubmits = false;
  @State() fatalErrorHeader = '';
  @State() fatalErrorMessage = '';
  @State() focusedField = '';
  @State() submitting = false;
  @State() submitted = false;
  @State() isDone = false;
  @State() showDone = false;
  @State() showLoadError = false;
  @State() finishLater = false;
  @State() showFinishLater = false;
  @State() agreed = false;
  @State() documentsSingularPlural = 'document';
  // TODO
  // @State() authStep: TRecipientAuthMethod | null = null;
  @State() authStep: string | null = null;
  @State() authDetails: any = null;
  @State() kbaQuestions: any[] = [];
  @State() showSpinner = false;
  @State() kbaChoices = [];

  @State() loading = true;
  @State() envelope: IEnvelope | null = null;

  // recipientIndex: number = -1;

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

      // NOTE: We don't listen to the store here because we are often an independent
      // session and might have a different "view" of the envelope.
      const {envelope, recipient, auth_step, auth_details} = await startSigningSession(this.endpoint, this.envelopeId, this.roleId, this.inviteCode);
      console.log(`[SIGN] Loaded signing session`, envelope, recipient);
      this.recipient = recipient;
      this.envelope = envelope;
      this.authStep = auth_step;
      this.authDetails = auth_details;
      this.agreed = recipient.agreed;
      this.submitted = recipient.status === 'submitted';
      this.isDone = this.submitted;
      this.showDone = this.submitted;

      Store.updateEnvelope(this.envelopeId, envelope);

      if (this.envelope.documents.length > 0) {
        this.documentsSingularPlural = 'document(s)';
      }

      const auth_method_states = (recipient.auth_method_states || {}) as Record<TRecipientAuthMethod, string>;
      if (Object.values(auth_method_states).includes('failed')) {
        this.fatalErrorHeader = 'Recipient Verification Failed';
        this.fatalErrorMessage = 'We were unable to verify your identity. The sender has been notified.';
        this.isDone = true;
      }

      // TODO: Envelope "complete" | "declined" | "canceled"
      // TODO: Recipient "canceled"

      if (this.envelope.status === 'canceled') {
        this.fatalErrorHeader = 'Unable to Start Signing Session';
        this.fatalErrorMessage = 'This envelope has been canceled. The sender has been notified.';
      } else if (recipient.status === 'declined') {
        this.fatalErrorHeader = 'Unable to Start Signing Session';
        this.fatalErrorMessage = 'You have declined to sign this envelope. The sender has been notified.';
      } else if (this.agreed) {
        this.nextButtonLabel = 'Next';
      }

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
          this.fatalErrorHeader = 'Declined';
          this.fatalErrorMessage = 'You have declined to sign this envelope. The sender has been notified.';
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
    console.log('[SIGN] updateRecipientFieldValue', fieldName, updateResult);
    this.getRecipientFields().forEach(oldField => {
      if (oldField.name === fieldName) {
        oldField.value = updateResult.value;
        // TODO: Keeping this while attachments still rely on it
        oldField.settings = updateResult.settings;
        updateDocumentFieldValue(oldField);
        this.checkRecipientFields();
      }
    });
  }

  saveFieldChange(fieldName: string, fields: Record<string, any>) {
    console.log('[SIGN] saveFieldChange', fieldName, fields);
    updateEnvelopeField(this.endpoint, this.envelopeId, fieldName, fields) //
      .then(updateResult => this.updateRecipientFieldValue(fieldName, updateResult))
      .catch(e => {
        if (e.response?.status === 401 && e.response?.data?.error === 'jwt expired') {
          console.log('[SIGN] Signing session expired');
          this.fatalErrorHeader = 'Signing Session Expired';
          this.fatalErrorMessage = 'Please reload your browser to continue.';
        } else {
          console.log('[SIGN] Server error', e);
        }

        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  async handleFieldChange(field: IEnvelopeField, e: any) {
    const {value, checked} = e.target;

    switch (field.type as any) {
      // TODO: Remove legacy type when no longer needed
      case 'textarea':
      case 'textbox':
        return this.saveFieldChange(field.name, {prepared: false, value});

      case 'checkbox': {
        return this.saveFieldChange(field.name, {prepared: false, value: String(e.target.checked)});
      }

      case 'radio': {
        return this.saveFieldChange(field.name, {prepared: false, value: String(e.target.checked)});
      }

      case 'dropdown':
        // TODO: Set prepared to false server-side.
        console.log('Saving dropdown', field.name, e.detail);
        return this.saveFieldChange(field.name, {prepared: false, value: e.detail});

      case 'initial':
        // This can be caused by a focus-out event if the user clicks the field
        // after it's already filled in, then clicks something else like a textbox.
        // We don't visually indicate the focus, but it's still there.
        if (!e.detail) {
          return;
        }

        this.showSpinner = true;
        const initialsBlob = await (await fetch(e.detail)).blob();
        return createInitials(this.endpoint, 'initial', initialsBlob) //
          .then(async newInitials => {
            const updateResult = await updateEnvelopeFieldInitials(this.endpoint, this.envelopeId, field.name, newInitials.id);
            this.updateRecipientFieldValue(field.name, updateResult);
            this.showSpinner = false;
          })
          .catch(e => {
            console.log('Error updating initials', e);
            this.showSpinner = false;
          });

      case 'signature':
        // This can be caused by a focus-out event if the user clicks the field
        // after it's already filled in, then clicks something else like a textbox.
        // We don't visually indicate the focus, but it's still there.
        if (!e.detail) {
          return;
        }

        this.showSpinner = true;
        const signatureBlob = await (await fetch(e.detail)).blob();
        return createSignature(this.endpoint, 'signature', signatureBlob) //
          .then(async newSignature => {
            console.log('Signature update result', newSignature);
            const updateResult = await updateEnvelopeFieldSignature(this.endpoint, this.envelopeId, field.name, newSignature.id);
            this.updateRecipientFieldValue(field.name, updateResult);
            this.showSpinner = false;
          })
          .catch(e => {
            console.warn('[SIGN] Error updating signature', e);
            this.showSpinner = false;
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
      case 'textarea':
      case 'textbox':
        switch (field.validator || '') {
          case 'email':
            return isValidEmail(value);
          case 'phone':
            return isValidPhone(value);
          default:
            return (value || '').trim() !== '';
        }

      case 'signature':
        return value === 'signed';

      case 'initial':
        return value === 'initialed';

      // Timestamp fields get automatically filled when the envelope is submitted.
      case 'timestamp':
        return true;

      case 'date':
        return !!value;

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
    sortFields(recipientFields);
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
        console.log('[SIGN] Reloading envelope');
        getEnvelope(this.endpoint, this.envelopeId)
          .then(envelope => {
            this.envelope = envelope;
            // The show-done dialog does this
            // this.isDone = true;
            this.submitting = false;
          })
          .catch(e => {
            // this.isDone = true;
            console.log('[SIGN] Error reloading envelope', e);
            this.submitting = false;
          });
      } catch (e) {
        console.log('[SIGN] Error submitting', e);
      }

      return;
    }

    // Find and focus the next incomplete field (that is fillable)
    const emptyFields = this.getSortedFillableFields().filter(field => field.required && !this.isFieldFilled(field));
    sortFields(emptyFields);

    const focusedIndex = emptyFields.findIndex(field => field.name === this.focusedField);
    let nextFocusedIndex = focusedIndex + 1;
    if (nextFocusedIndex >= emptyFields.length) {
      nextFocusedIndex = 0;
    }

    let nextRequiredField = emptyFields[nextFocusedIndex];
    // console.log('Next field', nextRequiredField, emptyFields);

    // Skip signature and initial fields that are already filled in. We have to count our "skips" just in case, to avoid infinite loops.
    let skips = 0;
    if (skips < emptyFields.length && ['signature', 'initial'].includes(nextRequiredField.type) && ['initialed', 'signed'].includes(nextRequiredField.value)) {
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
      el?.scrollIntoView({behavior: 'smooth'});
      el?.focusField();
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
      console.log(
        '[SIGN] Invalid fields remaining',
        invalidFields.map(field => field.name),
      );
      this.nextButtonLabel = 'Next';
      this.nextSubmits = false;
    }
  }

  attachFieldAttributes(pageInfo, field, el) {
    // We can get called multiple times as rendering completes and it's hard to avoid that
    // because it's a ton of work for the callers to know it's been done already. But we
    // don't want to attach multiple event listeners or we get dupe event handling, like
    // calling the server twice on every field update. Since JS has no removeAllEventListeners()
    // option, using removeEventListener() isn't reliable the way Stencil binds local function
    // contexts, and cloneNode messes up the rest of the rendering, we just track it with a flag.
    if (el.getAttribute('attached') === '1') {
      return;
    }
    el.setAttribute('attached', '1');

    el.addEventListener('input', (e: any) => {
      // console.log('[SIGN] onfieldInput', e.detail, e.target.value);
      // These field types don't emit fieldChange. Should we standardize on that? We don't tap "input" for fields like
      // text boxes because we'd be updating the field on every keystroke. We do those on blur which fires fieldChange.
      if (e.target.type === 'radio' || e.target.type === 'checkbox') {
        // if (e.target.type === 'radio' || e.target.name.includes('date') || e.target.name.includes('checkbox')) {
        this.handleFieldChange(field, e).finally(() => this.checkRecipientFields());
      } else {
        this.checkRecipientFields();
      }
    });
    el.addEventListener('attached', async (e: any) => {
      console.log('[SIGN] onAttached', e.detail, e.target.value);
      this.showSpinner = true;
      try {
        const updateResult = await uploadEnvelopeFieldAttachment(this.endpoint, this.envelopeId, field.name, e.detail);
        this.updateRecipientFieldValue(field.name, updateResult);
        this.checkRecipientFields();

        const newEl = renderDocumentField('envelope', field, pageInfo, {disabled: false, editable: false, draggable: false, done: this.isDone});
        this.attachFieldAttributes(pageInfo, field, newEl);

        this.showSpinner = false;
      } catch (e) {
        console.log('Error uploading attachment', e);
        VerdocsToast('Unable to upload attachment, please try again later', {style: 'error'});
        this.showSpinner = false;
      }
    });
    el.addEventListener('deleted', async (e: any) => {
      console.log('[SIGN] onDeleted', e.detail, e.target.value);
      this.showSpinner = true;
      try {
        const updateResult = await deleteEnvelopeFieldAttachment(this.endpoint, this.envelopeId, field.name);
        console.log('[SIGN] Deleted attachment', updateResult);
        this.updateRecipientFieldValue(field.name, updateResult);
        this.checkRecipientFields();

        const newEl = renderDocumentField('envelope', field, pageInfo, {disabled: false, editable: false, draggable: false, done: this.isDone});
        this.attachFieldAttributes(pageInfo, field, newEl);

        this.showSpinner = false;
      } catch (e) {
        console.log('Error uploading attachment', e);
        VerdocsToast('Unable to upload attachment, please try again later', {style: 'error'});
        this.showSpinner = false;
      }
    });
    el.addEventListener('focusout', e => {
      // These field types trigger focusout as they're used, even without a value change
      if (field.type !== 'dropdown' && field.type !== 'attachment') {
        this.handleFieldChange(field, e).finally(() => this.checkRecipientFields());
      }
    });
    el.addEventListener('fieldChange', e => {
      this.handleFieldChange(field, e).finally(() => this.checkRecipientFields());
    });

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
    console.log('[SIGN] Rendering fields for page', pageInfo.pageNumber, recipientFields);

    // First render the fields for the signer
    recipientFields.forEach((field, tabIndex) => {
      if (field.page !== pageInfo.pageNumber) {
        return;
      }

      const el = renderDocumentField('envelope', field, pageInfo, {disabled: false, editable: false, draggable: false, done: this.isDone}, tabIndex);
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
    this.envelope.recipients
      .filter(r => r.role_name !== this.recipient.role_name && (r.status === 'invited' || r.status === 'opened' || r.status === 'pending'))
      .forEach(() => {
        this.getRecipientFields()
          .filter(field => field.page === pageInfo.pageNumber)
          .forEach(field => {
            const el = renderDocumentField('envelope', field, pageInfo, {disabled: true, editable: false, draggable: false, done: this.isDone});
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

  handleAuthenticateSigner(params: TAuthenticateRecipientRequest) {
    console.log('[SIGN] Submitting authentication step', params);
    authenticateSigner(this.endpoint, params)
      .then(r => {
        console.log('[SIGN] Authentication successful', r);
        this.authStep = r.auth_step;
        this.authDetails = r.auth_details;
      })
      .catch(e => {
        console.log('[SIGN] Error submitting authentication step', e);
        if (e.response?.data?.error?.includes('failed')) {
          this.fatalErrorHeader = 'Recipient Verification Failed';
          this.fatalErrorMessage = 'We were unable to verify your identity. The sender has been notified.';
          this.isDone = true;
        } else {
          VerdocsToast(e.response?.data?.error || 'Unable to verify your identity. Please try again.', {style: 'error'});
        }
      });
  }

  render() {
    console.log('[SIGN] Rendering', {authStep: this.authStep});
    if (this.showLoadError) {
      return (
        <Host>
          <verdocs-ok-dialog
            heading="Unable to Start Signing"
            message={`Sorry, your invite code is invalid or has expired. Please check your email for an updated invitation, or contact the sender.`}
            buttonLabel="OK"
            onNext={() => {
              window.location.reload();
            }}
          />
        </Host>
      );
    }

    if (!this.envelope) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    if (this.fatalErrorMessage) {
      return (
        <Host class={{agreed: this.agreed}}>
          <div class="fatal-error">
            <div class="message">
              <div class="header">{this.fatalErrorHeader}</div>
              <p>{this.fatalErrorMessage}</p>
            </div>
          </div>
        </Host>
      );
    }

    if (this.isDone) {
      return (
        <Host class={{agreed: this.agreed}}>
          <verdocs-view endpoint={this.endpoint} envelopeId={this.envelopeId} onSdkError={e => this.sdkError?.emit(e.detail)} />

          {this.showDone && (
            <verdocs-ok-dialog
              heading="You're Done!"
              message={`You can access the ${this.documentsSingularPlural} at any time by clicking on the link from the invitation email.<br /><br />After all recipients have completed their actions, you will receive an email with the document and envelope certificate attached.`}
              onNext={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
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

    if (!this.agreed) {
      return (
        <Host class="agreed">
          <div id="verdocs-sign-header">
            <div class="inner">
              <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
              <div class="title">{this.envelope.name}</div>
            </div>
          </div>

          <div class="document" style={{paddingTop: '15px'}}>
            <img
              src="https://public-assets.verdocs.com/loading-placeholder.png"
              style={{width: '612px', height: '792px', boxShadow: '0 0 10px 5px #0000000f', marginTop: '15px'}}
              alt="Placeholder page"
            />
          </div>

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
                  Agree to Verdocs'{' '}
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
        </Host>
      );
    }

    if (this.authStep === 'passcode') {
      return (
        <Host class="kba">
          <div id="verdocs-sign-header">
            <div class="inner">
              <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
              <div class="title">{this.envelope.name}</div>
            </div>
          </div>

          <div class="document" style={{paddingTop: '15px'}}>
            <img
              src="https://public-assets.verdocs.com/loading-placeholder.png"
              style={{width: '612px', height: '792px', boxShadow: '0 0 10px 5px #0000000f', marginTop: '15px'}}
              alt="Placeholder page"
            />
          </div>

          <div class="cover">
            <div class="kba">
              <verdocs-kba-dialog
                mode="text"
                step={1}
                steps={1}
                placeholder="Enter your passcode..."
                helptitle="Document is protected by a Passcode"
                helptext="Please enter your Passcode to proceed. If you do not have one, please contact the sender."
                label="Passcode"
                onNext={e => this.handleAuthenticateSigner({auth_method: 'passcode', code: e.detail as string})}
              />
            </div>
          </div>
        </Host>
      );
    }

    if (this.authStep === 'kba') {
      return (
        <Host class="kba">
          <div id="verdocs-sign-header">
            <div class="inner">
              <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
              <div class="title">{this.envelope.name}</div>
            </div>
          </div>

          <div class="document" style={{paddingTop: '15px'}}>
            <img
              src="https://public-assets.verdocs.com/loading-placeholder.png"
              style={{width: '612px', height: '792px', boxShadow: '0 0 10px 5px #0000000f', marginTop: '15px'}}
              alt="Placeholder page"
            />
          </div>

          <div class="cover">
            <div class="kba">
              <verdocs-kba-dialog
                mode="identity"
                helptitle="Document requires identity verification"
                helptext="Please complete your contact details to proceed."
                recipient={this.recipient}
                onNext={async e => {
                  const recipDetails = e.detail as IRecipient;
                  this.handleAuthenticateSigner({
                    auth_method: 'kba',
                    first_name: recipDetails.first_name,
                    last_name: recipDetails.last_name,
                    address: recipDetails.address,
                    city: recipDetails.city,
                    state: recipDetails.state,
                    zip: recipDetails.zip,
                    dob: recipDetails.dob,
                  });
                }}
              />
            </div>
          </div>
        </Host>
      );
    }

    // if (this.kbaStep === 'challenge') {
    //   const questionNumber = this.kbaChoices.length;
    //   const kbaQuestion = this.kbaQuestions[questionNumber];
    //   return (
    //     <Host class="kba">
    //       <div id="verdocs-sign-header">
    //         <div class="inner">
    //           <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
    //           <div class="title">{this.envelope.name}</div>
    //         </div>
    //       </div>
    //
    //       <div class="document" style={{paddingTop: '15px'}}>
    //         <img
    //           src="https://public-assets.verdocs.com/loading-placeholder.png"
    //           style={{width: '612px', height: '792px', boxShadow: '0 0 10px 5px #0000000f', marginTop: '15px'}}
    //           alt="Placeholder page"
    //         />
    //       </div>
    //
    //       <div class="cover">
    //         <div class="kba">
    //           {this.kbaChoices.length >= this.kbaQuestions.length ? (
    //             <verdocs-spinner />
    //           ) : (
    //             <verdocs-kba-dialog
    //               mode="choice"
    //               helptitle="Your identity requires additional verification"
    //               helptext={kbaQuestion?.prompt || 'Please select one of the options below.'}
    //               choices={kbaQuestion?.answer || ['Skip Question']}
    //               step={questionNumber + 1}
    //               steps={this.kbaQuestions.length}
    //               onNext={async (e: any) => {
    //                 const answer = e.detail as string;
    //                 this.kbaChoices = [...this.kbaChoices, answer];
    //                 if (this.kbaChoices.length >= this.kbaQuestions.length) {
    //                   const responses = this.kbaQuestions.map((q, i) => ({type: q.type, answer: this.kbaChoices[i]}));
    //                   console.log('Submitting KBA responses', this.kbaChoices, responses);
    //                   try {
    //                     const response = await submitKbaChallengeResponse(this.endpoint, this.envelopeId, this.roleId, responses);
    //                     console.log('KBA challenge response', response);
    //                     this.kbaStep = response.kba_step;
    //                     if (this.kbaStep === 'failed') {
    //                       this.fatalErrorHeader = 'Identity Verification Failed';
    //                       this.fatalErrorMessage = 'We were unable to verify your identity. The sender has been notified.';
    //                       this.isDone = true;
    //                     } else {
    //                       this.kbaQuestions = (response as any).questions?.question || [];
    //                       this.kbaChoices = [];
    //                     }
    //                   } catch (e) {
    //                     console.log('Error submitting KBA challenge', e);
    //                     this.kbaStep = '';
    //                     this.fatalErrorHeader = 'Unable to Verify Identity';
    //                     this.fatalErrorMessage = e.response?.data?.error || 'Please try again later.';
    //                     this.isDone = true;
    //                   }
    //                 }
    //               }}
    //             />
    //           )}
    //         </div>
    //       </div>
    //     </Host>
    //   );
    // }

    return (
      <Host>
        <div id="verdocs-sign-header">
          <div class="inner">
            <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
            <div class="title">{this.envelope.name}</div>
            <div style={{flex: '1'}} />

            {!this.finishLater && <verdocs-button size="xsmall" label={this.nextButtonLabel} disabled={!this.agreed} onClick={() => this.handleNext()} />}

            <div style={{marginLeft: '10px'}} />
            <verdocs-dropdown options={!this.isDone && !this.finishLater ? inProgressMenuOptions : doneMenuOptions} onOptionSelected={e => this.handleOptionSelected(e)} />
          </div>
        </div>

        <div class="document" style={{paddingTop: '15px'}}>
          {(this.envelope.documents || []).map(envelopeDocument => {
            const pageNumbers = integerSequence(1, envelopeDocument.pages);

            return (
              <Fragment>
                {pageNumbers.map(pageNumber => {
                  const pageSize = envelopeDocument.page_sizes?.[pageNumber] || {width: 612, height: 792};

                  // In signing mode we show the original template page with all the recipient fields so we can show source formatting and
                  // where everything went. This is also a visual indicator when optional fields weren't filled in by previous actors, or
                  // future signers still need to act. Once we're "done" we flip to showing the envelope's documents which have the final
                  // field vales (so far) stamped into them.
                  // TODO: Confirm that a pure page-number match is good enough to find the matching template page. We need to make sure
                  //  we either don't reset our page numbers for additional attachments, or add match-on identifiers to work around that.
                  // console.log('tp', templatePage, page);
                  return (
                    <verdocs-envelope-document-page
                      envelopeId={this.envelopeId}
                      documentId={envelopeDocument.id}
                      endpoint={this.endpoint}
                      virtualWidth={pageSize.width}
                      virtualHeight={pageSize.height}
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

        {this.submitting ||
          (this.showSpinner && (
            <verdocs-portal>
              <div class="spinner-overlay">
                <verdocs-spinner />
              </div>
            </verdocs-portal>
          ))}
      </Host>
    );
  }
}
