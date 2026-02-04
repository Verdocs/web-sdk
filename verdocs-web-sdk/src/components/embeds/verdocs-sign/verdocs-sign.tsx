import {Element, Event, EventEmitter, Host, Fragment, Component, Prop, State, h} from '@stencil/core';
import {uploadEnvelopeFieldAttachment, VerdocsEndpoint, TRecipientAuthMethod, getEnvelopeDocumentDownloadLink, getEnvelopesZip} from '@verdocs/js-sdk';
import {askQuestion, DEFAULT_DISCLOSURES, integerSequence, isFieldFilled, isFieldValid} from '@verdocs/js-sdk';
import {verifySigner, IEnvelope, IEnvelopeField, IRecipient, TAuthenticateRecipientRequest} from '@verdocs/js-sdk';
import {fullNameToInitials, startSigningSession, deleteEnvelopeFieldAttachment, formatFullName} from '@verdocs/js-sdk';
import {updateEnvelopeField, sortFields, IKBAQuestion, ISignerTokenResponse, delegateRecipient} from '@verdocs/js-sdk';
import {createInitials, createSignature, envelopeRecipientAgree, envelopeRecipientDecline, envelopeRecipientSubmit} from '@verdocs/js-sdk';
import {getFieldId, renderDocumentField, renderDocumentFlag, updateDocumentFieldValue, defaultHeight} from '../../../utils/utils';
import {DocumentPageIcon} from '../../../utils/Icons';
import {IDocumentPageInfo} from '../../../utils/Types';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const ToolbarMinusIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 8C11.2761 8 11.5 8.22386 11.5 8.5C11.5 8.77614 11.2761 9 11 9H6C5.72386 9 5.5 8.77614 5.5 8.5C5.5 8.22386 5.72386 8 6 8H11ZM14 8.5C14 5.46243 11.5376 3 8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.1464 16.8536L16.2157 16.9114C16.4106 17.0464 16.68 17.0271 16.8536 16.8536C17.0488 16.6583 17.0488 16.3417 16.8536 16.1464L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z" fill="#424242" /></svg>`;
const ToolbarPlusIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 8.5C11.5 8.22386 11.2761 8 11 8H9V6C9 5.72386 8.77614 5.5 8.5 5.5C8.22386 5.5 8 5.72386 8 6V8H6C5.72386 8 5.5 8.22386 5.5 8.5C5.5 8.77614 5.72386 9 6 9H8V11C8 11.2761 8.22386 11.5 8.5 11.5C8.77614 11.5 9 11.2761 9 11V9H11C11.2761 9 11.5 8.77614 11.5 8.5ZM8.5 3C11.5376 3 14 5.46243 14 8.5C14 9.83879 13.5217 11.0659 12.7266 12.0196L16.8536 16.1464C17.0488 16.3417 17.0488 16.6583 16.8536 16.8536C16.68 17.0271 16.4106 17.0464 16.2157 16.9114L16.1464 16.8536L12.0196 12.7266C11.0659 13.5217 9.83879 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 5.46243 5.46243 3 8.5 3ZM8.5 4C6.01472 4 4 6.01472 4 8.5C4 10.9853 6.01472 13 8.5 13C10.9853 13 13 10.9853 13 8.5C13 6.01472 10.9853 4 8.5 4Z" fill="#424242" /></svg>`;
const ToolbarDownloadIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 16.9988C15.7761 16.9988 16 17.2226 16 17.4988C16 17.7442 15.8231 17.9484 15.5899 17.9907L15.5 17.9988H4.5C4.22386 17.9988 4 17.7749 4 17.4988C4 17.2533 4.17688 17.0492 4.41012 17.0068L4.5 16.9988H15.5ZM10.0001 2.00098C10.2456 2.00098 10.4497 2.17798 10.492 2.41124L10.5 2.50112L10.496 14.295L14.1414 10.6466C14.3148 10.4729 14.5842 10.4534 14.7792 10.5882L14.8485 10.646C15.0222 10.8194 15.0418 11.0888 14.907 11.2838L14.8492 11.3531L10.3574 15.8531C10.285 15.9257 10.1957 15.9714 10.1021 15.9901L9.99608 15.9999C9.83511 15.9999 9.69192 15.9237 9.60051 15.8056L5.14386 11.3537C4.94846 11.1586 4.94823 10.842 5.14336 10.6466C5.3168 10.4729 5.58621 10.4534 5.78117 10.5883L5.85046 10.6461L9.496 14.287L9.5 2.50083C9.50008 2.22469 9.724 2.00098 10.0001 2.00098Z" fill="#424242"/></svg>`;
const ToolbarPrintIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.5C5 3.67157 5.67157 3 6.5 3H13.5C14.3284 3 15 3.67157 15 4.5V5H15.5C16.8807 5 18 6.11929 18 7.5V12.5C18 13.3284 17.3284 14 16.5 14H15V15.5C15 16.3284 14.3284 17 13.5 17H6.5C5.67157 17 5 16.3284 5 15.5V14H3.5C2.67157 14 2 13.3284 2 12.5V7.5C2 6.11929 3.11929 5 4.5 5H5V4.5ZM6 5H14V4.5C14 4.22386 13.7761 4 13.5 4H6.5C6.22386 4 6 4.22386 6 4.5V5ZM5 13V11.5C5 10.6716 5.67157 10 6.5 10H13.5C14.3284 10 15 10.6716 15 11.5V13H16.5C16.7761 13 17 12.7761 17 12.5V7.5C17 6.67157 16.3284 6 15.5 6H4.5C3.67157 6 3 6.67157 3 7.5V12.5C3 12.7761 3.22386 13 3.5 13H5ZM6.5 11C6.22386 11 6 11.2239 6 11.5V15.5C6 15.7761 6.22386 16 6.5 16H13.5C13.7761 16 14 15.7761 14 15.5V11.5C14 11.2239 13.7761 11 13.5 11H6.5Z" fill="#424242"/></svg>`;

/**
 * Helper to generate a human-readable label for a field.
 */
const getFieldLabel = (field: IEnvelopeField) => {
  if (!field) return '';
  const typeMap: Record<string, string> = {
    signature: 'Signature',
    initial: 'Initials',
    date: 'Date',
    textbox: 'Text Field',
    checkbox: 'Checkbox',
    radio: 'Radio Button',
    dropdown: 'Dropdown',
    attachment: 'Attachment',
    payment: 'Payment',
  };

  const typeName = typeMap[field.type] || 'Field';
  if (field.required) {
    return `Required ${typeName}*`;
  }
  return `Optional ${typeName}`;
};

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
 *
 * ```ts
 * <verdocs-sign
 *   envelopeId={ENVELOPE_ID}
 *   roleId={ROLE_ID}
 *   inviteCode={INVITE_CODE}
 *   onEnvelopeUpdated={({ detail }) => console.log('Envelope updated state:', detail) }
 *   onSdkError={({ detail }) => { console.log('SDK error', detail) }}
 *   />
 * ```
 */
@Component({
  tag: 'verdocs-sign',
  styleUrl: 'verdocs-sign.scss',
  shadow: false,
})
export class VerdocsSign {
  @Element() el: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop({mutable: true}) endpoint: VerdocsEndpoint = new VerdocsEndpoint({sessionType: 'signing'});

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
   * The style of the toolbar to display.
   */
  @Prop() toolbarStyle: 'controls' | 'menu' = 'controls';

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the envelope is loaded for the first time.
   */
  @Event({composed: true}) envelopeLoaded: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope}>;

  /**
   * Event fired when the envelope is updated in any way.
   */
  @Event({composed: true}) envelopeUpdated: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope; event: string}>;

  @State() recipient: IRecipient | null = null;
  @State() hasSignature = false;
  @State() nextButtonLabel = 'Start';
  @State() nextSubmits = false;
  @State() fatalErrorHeader = '';
  @State() fatalErrorMessage = '';
  @State() focusedField = '';
  @State() disclosures = DEFAULT_DISCLOSURES;
  @State() fieldUpdateCounter = 0;
  @State() submitting = false;
  @State() submitted = false;
  @State() isDone = false;
  @State() showDone = false;
  @State() adoptingSignature = false;
  @State() showLoadError = false;
  @State() finishLater = false;
  @State() showFinishLater = false;
  @State() agreed = false;
  @State() signatureId: string | null = null;
  @State() initialId: string | null = null;

  @State() documentsSingularPlural = 'document';
  @State() authStep: string | null = null;
  @State() authMethodStates: Partial<Record<TRecipientAuthMethod, string>> = {};
  @State() pageNumber = 1;
  @State() kbaQuestions: IKBAQuestion[] | null = null;
  @State() showSpinner = false;
  // @State() fieldUpdateCounter = 0;
  @State() declining = false;
  @State() delegating = false;
  @State() delegated = false;
  @State() kbaChoices = [];
  @State() showDownloadDialog = false;

  @State() loading = true;
  @State() envelope: IEnvelope | null = null;
  @State() zoomLevel: 'normal' | 'zoom1' | 'zoom2' = 'normal';

  private renderedPages: Record<string, IDocumentPageInfo> = {};
  private observer: IntersectionObserver;

  async componentDidLoad() {
    this.updateZoomFromWindow();
    window.addEventListener('resize', () => this.updateZoomFromWindow());
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
      const response = await startSigningSession(this.endpoint, this.envelopeId, this.roleId, this.inviteCode);
      this.processAuthResponse(response);

      const fillable = this.getSortedFillableFields();
      if (fillable.length > 0) {
        setTimeout(() => {
          this.focusedField = fillable[0].name;
        }, 500);
      }
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

    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    window.removeEventListener('resize', () => this.updateZoomFromWindow());
  }

  updateZoomFromWindow() {
    const width = window.innerWidth;
    if (width < 768) {
      if (this.zoomLevel !== 'zoom2') this.zoomLevel = 'zoom2';
    } else if (width < 1024) {
      if (this.zoomLevel !== 'zoom1') this.zoomLevel = 'zoom1';
    } else {
      if (this.zoomLevel !== 'normal') this.zoomLevel = 'normal';
    }
  }

  setupIntersectionObserver() {
    // We only want to set this up once the elements exist
    const pages = this.el.querySelectorAll('verdocs-envelope-document-page');
    if (pages.length === 0) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    const container = this.el.querySelector('.signed-document-container');
    const options = {
      root: container,
      rootMargin: '-40% 0px -40% 0px', // Helper to trigger when the middle 20% is visible
      threshold: 0,
    };

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pageId = entry.target.id; // page-1
          const pageNum = parseInt(pageId.replace('page-', ''), 10);
          if (!isNaN(pageNum) && this.pageNumber !== pageNum) {
            // console.log('[SIGN] Updated page number via scroll', pageNum);
            this.pageNumber = pageNum;
          }
        }
      });
    }, options);

    pages.forEach(page => this.observer.observe(page));
  }

  processAuthResponse(response: ISignerTokenResponse) {
    const {envelope, recipient} = response;

    // TODO: Temporary fix for multi-doc ordering until the server-side ordering is fixed
    envelope.documents?.sort((a, b) => (a.order !== b.order ? b.order - a.order : b.created_at.localeCompare(a.created_at)));

    const {auth_step} = recipient;
    this.recipient = recipient;
    this.envelope = envelope;
    this.disclosures = this.envelope?.organization?.disclaimer || DEFAULT_DISCLOSURES;
    this.authStep = auth_step;
    this.delegated = !!recipient.delegated_to;
    this.agreed = recipient.agreed;
    this.signatureId = response.signatures?.[0]?.id || null;
    this.initialId = response.initials?.[0]?.id || null;
    this.submitted = recipient.status === 'submitted';
    this.loading = false;
    this.isDone = this.submitted;
    this.showDone = this.submitted;
    Store.updateEnvelope(this.envelopeId, envelope);

    if (this.envelope.documents.length > 0) {
      this.documentsSingularPlural = 'document(s)';
    }

    this.authMethodStates = recipient.auth_method_states || ({} as Record<TRecipientAuthMethod, string>);
    this.kbaQuestions = recipient.kba_questions;
    if (Object.values(this.authMethodStates).includes('failed')) {
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
      this.fatalErrorHeader = 'Declined';
      this.fatalErrorMessage = 'You have declined to sign this request. The sender has been notified.';
    } else if (this.agreed) {
      this.nextButtonLabel = 'Next';
    }

    this.checkRecipientFields();
    this.envelopeLoaded?.emit({endpoint: this.endpoint, envelope: this.envelope});
  }

  handleClickAgree() {
    this.submitting = true;
    console.log('[SIGN] Accepting disclosures', this.disclosures);
    envelopeRecipientAgree(this.endpoint, this.envelopeId, this.roleId, this.disclosures)
      .then(() => {
        this.nextButtonLabel = 'Next';
        this.recipient.agreed = true;
        this.submitting = false;
        this.agreed = true; // The server returns a recipient object but it's not "deep" so we track this locally
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'agreed'});
      })
      .catch(e => {
        console.log('[SIGN] Unable to accept disclosures', e);
        VerdocsToast('Unable to accept disclosures, please try again later', {style: 'error'});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
        this.submitting = false;
      });
  }

  handlePageSelect(e: any) {
    const pageNumber = parseInt(e.target.value);
    if (!isNaN(pageNumber)) {
      this.pageNumber = pageNumber;
      // We manually scroll the container to the top of the page element.
      // This avoids issues where the page might be nested or scrollIntoView behaves unexpectedly.
      const container = this.el.querySelector('.signed-document-container');
      const pageEl = this.el.querySelector(`#page-${pageNumber}`) as HTMLElement;

      if (container && pageEl) {
        // 20px buffer for visual spacing
        const top = pageEl.offsetTop - 20;
        container.scrollTo({top, behavior: 'smooth'});
      }
    }
  }

  async handleOptionSelected(e: any) {
    switch (e.detail.id) {
      case 'later':
        this.finishLater = true;
        this.showFinishLater = true;
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'later'});
        break;

      case 'delegate':
        this.delegating = true;
        break;

      case 'decline':
        this.declining = true;
        break;

      case 'print':
        window.print();
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'printed'});
        break;

      case 'download':
        this.showDownloadDialog = true;
        break;
    }
  }

  handleZoomIn() {
    if (this.zoomLevel === 'normal') {
      this.zoomLevel = 'zoom1';
    } else if (this.zoomLevel === 'zoom1') {
      this.zoomLevel = 'zoom2';
    }
  }

  handleZoomOut() {
    if (this.zoomLevel === 'zoom1') {
      this.zoomLevel = 'normal';
    } else if (this.zoomLevel === 'zoom2') {
      this.zoomLevel = 'zoom1';
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
        this.fieldUpdateCounter++;
        this.checkRecipientFields();
      }
    });
  }

  saveFieldChange(fieldName: string, value: string, prepared: boolean) {
    // Although the inputs disable themselves, the blur handler can still try to re-save
    // the value already in the field. Bypassing that here is easier than adding yet more
    // logic to the fields.
    const field = this.getRecipientFields().find(field => field.name === fieldName);
    if (field?.readonly) {
      return;
    }

    console.log('[SIGN] saveFieldChange', fieldName, {value, prepared});
    updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, fieldName, value, prepared)
      .then(updateResult => this.updateRecipientFieldValue(fieldName, updateResult))
      .catch(e => {
        if (e.response?.status === 401 && e.response?.data?.error === 'jwt expired') {
          console.log('[SIGN] Signing session expired');
          this.fatalErrorHeader = 'Signing Session Expired';
          this.fatalErrorMessage = 'Please reload your browser to continue.';
        } else {
          console.log('[SIGN] Server error', e);
          VerdocsToast('Unable to save change, please try again later', {style: 'error'});
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
        return this.saveFieldChange(field.name, value, false);

      case 'checkbox': {
        return this.saveFieldChange(field.name, String(e.target.checked), false);
      }

      case 'radio': {
        return this.saveFieldChange(field.name, String(e.target.checked), false);
      }

      case 'dropdown':
        // TODO: Set prepared to false server-side.
        console.log('Saving dropdown', field.name, e.detail);
        return this.saveFieldChange(field.name, e.detail, false);

      case 'initial':
        // This can be caused by a focus-out event if the user clicks the field
        // after it's already filled in, then clicks something else like a textbox.
        // We don't visually indicate the focus, but it's still there.
        // NOTE: We now allow null to clear the field
        if (e.detail === undefined) {
          return;
        }

        if (e.detail === null) {
          console.log('[SIGN] Clearing initial');
          const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, null, false);
          return this.updateRecipientFieldValue(field.name, updateResult);
        }

        // If we already have an initials block, apply it
        if (this.initialId) {
          console.log('[SIGN] Reusing initial', this.initialId);
          const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, this.initialId, false);
          return this.updateRecipientFieldValue(field.name, updateResult);
        }

        // If it's a UUID, it's an existing initial ID we can just reuse
        if (typeof e.detail === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e.detail)) {
          console.log('[SIGN] Reusing initial', e.detail);
          const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, e.detail, false);
          this.initialId = e.detail;
          return this.updateRecipientFieldValue(field.name, updateResult);
        }

        this.showSpinner = true;
        const initialsBlob = await (await fetch(e.detail)).blob();
        return createInitials(this.endpoint, 'initial', initialsBlob) //
          .then(async newInitials => {
            const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, newInitials.id, false);
            this.updateRecipientFieldValue(field.name, updateResult);
            this.initialId = newInitials.id;
            this.showSpinner = false;
          })
          .catch(e => {
            console.log('Error updating initials', e);
            VerdocsToast('Unable to save initials, please try again later', {style: 'error'});
            this.showSpinner = false;
          });

      case 'signature':
        // This can be caused by a focus-out event if the user clicks the field
        // after it's already filled in, then clicks something else like a textbox.
        // We don't visually indicate the focus, but it's still there.
        // NOTE: We now allow null to clear the field
        if (e.detail === undefined) {
          return;
        }

        if (e.detail === null) {
          console.log('[SIGN] Clearing signature');
          const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, null, false);
          return this.updateRecipientFieldValue(field.name, updateResult);
        }

        // If we already have a signature block, apply it
        if (this.signatureId) {
          console.log('[SIGN] Reusing signature', this.signatureId);
          const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, this.signatureId, false);
          return this.updateRecipientFieldValue(field.name, updateResult);
        }

        // If it's a UUID, it's an existing signature ID we can just reuse
        if (typeof e.detail === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e.detail)) {
          console.log('[SIGN] Reusing signature', e.detail);
          const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, e.detail, false);
          this.signatureId = e.detail;
          return this.updateRecipientFieldValue(field.name, updateResult);
        }

        this.showSpinner = true;
        const signatureBlob = await (await fetch(e.detail)).blob();
        console.log('[SIGN] Creating new signature');
        return createSignature(this.endpoint, 'signature', signatureBlob) //
          .then(async newSignature => {
            console.log('Signature update result', newSignature);
            const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, newSignature.id, false);
            this.updateRecipientFieldValue(field.name, updateResult);
            this.signatureId = newSignature.id;
            this.showSpinner = false;
          })
          .catch(e => {
            console.warn('[SIGN] Error updating signature', e);
            VerdocsToast('Unable to save signature, please try again later', {style: 'error'});
            this.showSpinner = false;
          });

      case 'date':
        const {formattedDate} = e.detail;
        if (formattedDate) {
          return this.saveFieldChange(field.name, formattedDate, false);
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

  getSortedFillableFields() {
    const recipientFields = this.getRecipientFields().filter(field => field.type !== 'timestamp' && !field.readonly);
    sortFields(recipientFields);
    return recipientFields;
  }

  handleNext() {
    if (this.nextSubmits) {
      try {
        // Patches the date picker to be forcibly removed if still showing during submission
        document.getElementById('air-datepicker-global-container')?.remove();

        this.submitting = true;
        const result = envelopeRecipientSubmit(this.endpoint, this.envelopeId, this.roleId);
        console.log('[SIGN] Submitted successfully', result);
        // TODO: The "proper" way is generating an error from Stencil
        //  NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which
        //  the new node is to be inserted is not a child of this node.
        window.location.reload();
      } catch (e) {
        console.log('[SIGN] Error submitting', e);
      }

      return;
    }

    const nextRequiredField = this.getNextRequiredField();

    if (nextRequiredField) {
      const id = getFieldId(nextRequiredField);
      const el = document.getElementById(id) as any;
      el?.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
      el?.focusField();
      this.focusedField = nextRequiredField.name;
    }
  }

  getRecipientFields() {
    return this.envelope?.fields.filter(field => field.role_name === this.recipient.role_name) || [];
  }

  // See if everything that "needs to be" filled in is, and all "fillable fields" are valid
  checkRecipientFields() {
    const invalidFields = this.getRecipientFields().filter(field => !isFieldValid(field, this.getRecipientFields()));
    if (invalidFields.length < 1) {
      this.nextButtonLabel = 'Finish';
      if (!this.nextSubmits) {
        this.nextSubmits = true;
      }
    } else {
      this.nextButtonLabel = 'Next';
      this.nextSubmits = false;
    }
    this.updateAllFlags();
  }

  getNextRequiredField() {
    // Find and focus the next incomplete field (that is fillable)
    const emptyFields = this.getSortedFillableFields().filter(field => field.required && !isFieldFilled(field, this.getRecipientFields()));
    sortFields(emptyFields);

    // console.log(
    //   '[SIGN] Pending fields',
    //   emptyFields.map(f => `${f.name} (${f.type}) req=${f.required}`),
    // );

    if (emptyFields.length === 0) {
      const allUnfilled = this.getSortedFillableFields().filter(field => !isFieldFilled(field, this.getRecipientFields()));
      sortFields(allUnfilled);
      if (allUnfilled.length > 0) {
        // If we are here, there are no required fields left, but there are optional ones.
        return this.getNextFieldFromList(allUnfilled);
      }
      return null;
    }

    return this.getNextFieldFromList(emptyFields);
  }

  getNextFieldFromList(fields: IEnvelopeField[]) {
    const focusedIndex = fields.findIndex(field => field.name === this.focusedField);
    let nextFocusedIndex = focusedIndex + 1;
    if (nextFocusedIndex >= fields.length) {
      nextFocusedIndex = 0;
    }

    // Note: isFieldFilled check above should handle 'initialed'/'signed'.
    return fields[nextFocusedIndex];
  }

  handlePrev() {
    const allFields = this.getSortedFillableFields();
    const focusedIndex = allFields.findIndex(f => f.name === this.focusedField);
    if (focusedIndex > 0) {
      const prevField = allFields[focusedIndex - 1];
      const id = getFieldId(prevField);
      const el = document.getElementById(id) as any;
      el?.scrollIntoView({behavior: 'smooth', block: 'center'});
      el?.focusField?.();
      this.focusedField = prevField.name;
    }
  }

  updateAllFlags() {
    Object.values(this.renderedPages).forEach(pageInfo => {
      this.updateFlagsForPage(pageInfo);
    });
  }

  updateFlagsForPage(pageInfo: IDocumentPageInfo) {
    if (!pageInfo) return;

    const controlsDiv = document.getElementById(pageInfo.containerId + '-controls');
    if (!controlsDiv) return;

    // Remove existing flags
    const existingFlags = controlsDiv.querySelectorAll('.verdocs-flag-instance');
    existingFlags.forEach(el => el.remove());

    let nextField = this.getNextRequiredField();
    const focusedFieldObj = this.getRecipientFields().find(f => f.name === this.focusedField);

    // If the currently focused field is unfilled, we should point the flag to IT, not the next one.
    // getNextRequiredField() is designed for the "Next" button (skipping current), but the visual flag
    // should guide the user to the current task if it's incomplete.
    if (focusedFieldObj && !isFieldFilled(focusedFieldObj, this.getRecipientFields())) {
      nextField = focusedFieldObj;
    }

    if (nextField && nextField.page === pageInfo.pageNumber && nextField.document_id === pageInfo.documentId) {
      const variant = 'fill';
      let label = 'FILL';
      let showSkip = false;

      if (!nextField.required) {
        label = 'FILL';
        showSkip = true; // Use the X to skip? Or just text? "Fill or Skip" implies maybe just text.
      }

      renderDocumentFlag(pageInfo, nextField.y, nextField.height || defaultHeight(nextField.type), {
        variant,
        label,
        showSkip,
        onSkip: () => {
          this.handleNext();
        },
        onClick: () => {
          const id = getFieldId(nextField);
          const el = document.getElementById(id) as any;
          el?.scrollIntoView({behavior: 'smooth', block: 'center'});
          el?.focusField?.();
        },
      });
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
        const updateResult = await uploadEnvelopeFieldAttachment(this.endpoint, this.envelopeId, this.roleId, field.name, e.detail);
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
        const updateResult = await deleteEnvelopeFieldAttachment(this.endpoint, this.envelopeId, this.roleId, field.name);
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
      // These field types trigger focusout as they're used, even without a value change.
      // Signature/Initial fields handle their own changes via fieldChange/adopt events, so we ignore focusout to prevent double-saves.
      if (field.type !== 'dropdown' && field.type !== 'attachment' && field.type !== 'signature' && field.type !== 'initial') {
        this.handleFieldChange(field, e).finally(() => this.checkRecipientFields());
      }
    });
    el.addEventListener('fieldChange', e => {
      this.handleFieldChange(field, e).finally(() => this.checkRecipientFields());
    });
    el.addEventListener('adopt', () => {
      this.focusedField = field.name;
      this.adoptingSignature = true;
    });

    el.setAttribute('templateid', this.envelope.template_id);
    el.setAttribute('fieldname', field.name);
    el.setAttribute('page', pageInfo.pageNumber);
    el.setAttribute('xScale', pageInfo.xScale);
    el.setAttribute('yScale', pageInfo.yScale);

    const fullName = formatFullName(this.recipient);
    el.setAttribute('initials', fullNameToInitials(fullName));
    el.setAttribute('name', fullName);
    if (this.signatureId) {
      el.setAttribute('signatureid', this.signatureId);
    }
    if (this.initialId) {
      el.setAttribute('initialid', this.initialId);
    }
  }

  handlePageRendered(e: any) {
    const pageInfo = e.detail as IDocumentPageInfo;
    this.renderedPages[`${pageInfo.documentId}:${pageInfo.pageNumber}`] = pageInfo;

    // console.log('Page rendered', pageInfo);

    // NOTE: We don't filter on pageNumber here because we need the position in the
    // entire list to set the tabIndex.
    const recipientFields = this.getSortedFillableFields();
    // console.log('[SIGN] Rendering fields for page', pageInfo.pageNumber, recipientFields);

    // First render the fields for the signer
    recipientFields
      .filter(field => field && field.document_id === pageInfo.documentId && field.page === pageInfo.pageNumber)
      .forEach((field, tabIndex) => {
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
          .filter(field => field.document_id === pageInfo.documentId && field.page === pageInfo.pageNumber)
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
    this.updateFlagsForPage(pageInfo);
  }

  handleAuthenticateSigner(params: TAuthenticateRecipientRequest) {
    console.log('[SIGN] Submitting authentication step', params);
    verifySigner(this.endpoint, params)
      .then(r => {
        console.log('[SIGN] Verification successful', r);
        this.processAuthResponse(r);
      })
      .catch(e => {
        console.log('[SIGN] Error submitting authentication step', e);
        console.log(e.response?.data);
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

    if (this.delegated) {
      return (
        <Host class={{agreed: false}}>
          <div class="fatal-error">
            <div class="message">
              <div class="header">Delegated Signing Request</div>
              <p>You have delegated signing to another recipient. You will not be able to sign this request again.</p>
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

    if (this.delegating) {
      return (
        <Host class="agreed">
          <div class="document" style={{paddingTop: '15px'}}>
            <img
              src="https://public-assets.verdocs.com/loading-placeholder.png"
              style={{width: '612px', height: '792px', boxShadow: '0 0 10px 5px #0000000f', marginTop: '15px'}}
              alt="Placeholder page"
            />
          </div>

          <verdocs-delegate-dialog
            endpoint={this.endpoint}
            envelope={this.envelope}
            onExit={() => (this.delegating = false)}
            onNext={(e: any) => {
              delegateRecipient(this.endpoint, this.envelopeId, this.roleId, e.detail)
                .then(r => {
                  VerdocsToast('Delegation request submitted.', {style: 'success'});
                  console.log('[SIGN] Delegated successfully', r);
                  this.delegated = true;
                  this.delegating = false;
                })
                .catch(e => {
                  console.log('[SIGN] Error delegating request', e);
                  VerdocsToast('Unable to process delegation request. Please try again later.', {style: 'error'});
                });
            }}
          />
        </Host>
      );
    }

    if (this.declining) {
      return (
        <Host class="agreed">
          <div class="document" style={{paddingTop: '15px'}}>
            <img
              src="https://public-assets.verdocs.com/loading-placeholder.png"
              style={{width: '612px', height: '792px', boxShadow: '0 0 10px 5px #0000000f', marginTop: '15px'}}
              alt="Placeholder page"
            />
          </div>

          <verdocs-ok-dialog
            heading="Decline Signing Request"
            message={`If you decline to sign this request, you will not be able to sign again in the future. The envelope sender will be notified.`}
            buttonLabel="OK"
            showCancel={true}
            onExit={() => (this.declining = false)}
            onNext={() => {
              envelopeRecipientDecline(this.endpoint, this.envelopeId, this.roleId)
                .then(r => {
                  console.log('[SIGN] Decline result', r);
                  window.location.reload();
                })
                .catch(e => {
                  console.warn('[SIGN] Error declining signing session', e);
                  VerdocsToast('Unable to decline, please try again later', {style: 'error'});
                });
            }}
          />
        </Host>
      );
    }

    if (!this.agreed) {
      return (
        <Host class="agreed">
          <div class="document" style={{paddingTop: '15px'}}>
            <img
              src="https://public-assets.verdocs.com/loading-placeholder.png"
              style={{width: '612px', height: '792px', boxShadow: '0 0 10px 5px #0000000f', marginTop: '15px'}}
              alt="Placeholder page"
            />
          </div>

          <verdocs-disclosure-dialog
            disclosures={this.disclosures}
            delegator={this.recipient.delegator}
            onDelegate={() => (this.delegating = true)}
            onDecline={() => (this.declining = true)}
            onAccept={() => this.handleClickAgree()}
          />
        </Host>
      );
    }

    if (this.authStep === 'passcode') {
      return <verdocs-passcode-dialog endpoint={this.endpoint} onNext={e => this.processAuthResponse(e.detail.response)} />;
    }

    if (this.authStep === 'email') {
      return (
        <verdocs-otp-dialog
          endpoint={this.endpoint}
          method="email"
          onNext={async e => {
            this.processAuthResponse(e.detail.response);
          }}
        />
      );
    }

    if (this.authStep === 'kba' && !this.authMethodStates.kba) {
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

    if (this.authStep === 'kba' && this.authMethodStates.kba === 'questions') {
      const questionNumber = this.kbaChoices.length;
      const kbaQuestion = this.kbaQuestions[questionNumber];
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
              {this.kbaChoices.length >= this.kbaQuestions.length ? (
                <verdocs-spinner />
              ) : (
                <verdocs-kba-dialog
                  mode="choice"
                  helptitle="Your identity requires additional verification"
                  helptext={kbaQuestion?.prompt || 'Please select one of the options below.'}
                  choices={kbaQuestion?.answer || ['Skip Question']}
                  step={questionNumber + 1}
                  steps={this.kbaQuestions.length}
                  onNext={async (e: any) => {
                    const answer = e.detail as string;
                    this.kbaChoices = [...this.kbaChoices, answer];
                    if (this.kbaChoices.length >= this.kbaQuestions.length) {
                      const responses = this.kbaQuestions.map((q, i) => ({type: q.type, answer: this.kbaChoices[i]}));
                      console.log('Submitting KBA responses', this.kbaChoices, responses);
                      this.handleAuthenticateSigner({auth_method: 'kba', responses});
                    }
                  }}
                />
              )}
            </div>
          </div>
        </Host>
      );
    }

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

    if (this.recipient.delegator) {
      inProgressMenuOptions.unshift({id: 'delegate', label: 'Delegate'});
    }

    const invalidFields = this.getRecipientFields().filter(field => !isFieldValid(field, this.getRecipientFields()));
    invalidFields.length > 0
      ? console.log(
          '[SIGN] Invalid fields remaining',
          invalidFields.map(field => field.name),
        )
      : console.log('[SIGN] All field valid');

    const totalPages = this.envelope.documents.reduce((acc, doc) => acc + doc.pages, 0);
    const pageOptions = integerSequence(1, totalPages).map(p => ({label: p.toString(), value: p.toString()}));
    let globalPageCounter = 0;

    return (
      <Host>
        {this.toolbarStyle === 'menu' && (
          <div id="verdocs-sign-header">
            <div class="inner">
              <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
              <div class="title">{this.envelope.name}</div>
              <div style={{flex: '1'}} />

              {!this.finishLater && <verdocs-button size="xsmall" label={this.nextButtonLabel} disabled={!this.agreed || this.submitting} onClick={() => this.handleNext()} />}

              <div style={{marginLeft: '10px'}} />
              <verdocs-dropdown options={!this.isDone && !this.finishLater ? inProgressMenuOptions : doneMenuOptions} onOptionSelected={e => this.handleOptionSelected(e)} />
            </div>
          </div>
        )}

        {this.toolbarStyle === 'controls' && (
          <div class="controls-toolbar">
            <div class="left-controls">
              <div class="title">{this.envelope.name}</div>
            </div>
            <div class="center-controls">
              <span class="label">Page</span>
              <div class="select-wrapper">
                <verdocs-select-input options={pageOptions} value={this.pageNumber.toString()} onInput={e => this.handlePageSelect(e)} />
              </div>
              <span class="count">of {totalPages}</span>
            </div>
            <div class="right-controls">
              <verdocs-button class="mobile-next-button" label={this.nextButtonLabel} size="xsmall" disabled={!this.agreed || this.submitting} onClick={() => this.handleNext()} />
              <div class={{'icon-button': true, 'minus': true, 'disabled': this.zoomLevel === 'normal'}} innerHTML={ToolbarMinusIcon} onClick={() => this.handleZoomOut()} />
              <div class={{'icon-button': true, 'plus': true, 'disabled': this.zoomLevel === 'zoom2'}} innerHTML={ToolbarPlusIcon} onClick={() => this.handleZoomIn()} />
              <div class="icon-button download" innerHTML={ToolbarDownloadIcon} onClick={() => this.handleOptionSelected({detail: {id: 'download'}})} />
              <div class="icon-button print" innerHTML={ToolbarPrintIcon} onClick={() => this.handleOptionSelected({detail: {id: 'print'}})} />
            </div>
          </div>
        )}

        {/* Progress Card */}
        {(() => {
          // Dependencies: focusedField, fieldUpdateCounter (to force re-calc)
          // console.log('[SIGN] Render progress', this.focusedField, this.fieldUpdateCounter);
          // Calculate detailed progress
          const allFields = this.getSortedFillableFields();
          const recipientFields = this.getRecipientFields();

          const isFilled = (f: IEnvelopeField) => isFieldFilled(f, recipientFields) && (f.type !== 'dropdown' || !!f.value);

          const requiredFields = allFields.filter(f => f.required);
          const requiredRemaining = requiredFields.filter(f => !isFilled(f)).length;

          const optionalFields = allFields.filter(f => !f.required);
          const optionalRemaining = optionalFields.filter(f => !isFilled(f)).length;

          const progress = {
            required: {
              remaining: requiredRemaining,
              total: requiredFields.length,
            },
            optional: {
              remaining: optionalRemaining,
              total: optionalFields.length,
            },
          };

          const focusedFieldObj = this.getSortedFillableFields().find(f => f.name === this.focusedField);
          const currentIndex = this.getSortedFillableFields().findIndex(f => f.name === this.focusedField) + 1;
          const totalFields = this.getSortedFillableFields().length;
          const remainingFields = this.getSortedFillableFields()
            .filter(f => f.required && !isFilled(f))
            .map(f => ({name: f.name, type: f.type, required: f.required}));

          console.log('[SIGN] Progress Debug:', {
            allFields: allFields.length,
            requiredFields: requiredFields.length,
            requiredRemaining,
            optionalFields: optionalFields.length,
            optionalRemaining,
            filledFields: recipientFields.filter(f => isFilled(f)).map(f => ({name: f.name, type: f.type, val: f.value})),
          });

          let mode: 'start' | 'signing' | 'completed' = 'start';
          // We only consider the user to have started "signing" if they have filled out at least one *fillable* field.
          // Readonly fields do not count.
          const anyFieldFilled = requiredRemaining < requiredFields.length || optionalRemaining < optionalFields.length;
          if (this.nextSubmits) {
            mode = 'completed';
          } else if (anyFieldFilled) {
            mode = 'signing';
          }

          return (
            <verdocs-signing-progress
              mode={mode}
              current={Math.max(1, currentIndex)}
              total={totalFields}
              remainingFields={remainingFields}
              progress={progress}
              fieldLabel={getFieldLabel(focusedFieldObj)}
              fieldCompleted={focusedFieldObj ? !!isFilled(focusedFieldObj) : false}
              onStarted={() => {
                this.adoptingSignature = true;
                // this.handleNext();
              }}
              onNext={() => this.handleNext()}
              onPrevious={() => this.handlePrev()}
              onExit={() => this.handleNext()}
            />
          );
        })()}

        <div class={`document signed-document-container zoom-${this.zoomLevel}`}>
          {(this.envelope.documents || []).map(envelopeDocument => {
            const pageNumbers = integerSequence(1, envelopeDocument.pages);

            return (
              <Fragment>
                {this.envelope.documents.length > 1 && (
                  <div class="document-separator">
                    <div innerHTML={DocumentPageIcon} />
                    <span>{envelopeDocument.name}</span>
                  </div>
                )}

                {pageNumbers.map(pageNumber => {
                  const pageSize = envelopeDocument.page_sizes?.[pageNumber] || {width: 612, height: 792};
                  globalPageCounter++;

                  // In signing mode we show the original template page with all the recipient fields so we can show source formatting and
                  // where everything went. This is also a visual indicator when optional fields weren't filled in by previous actors, or
                  // future signers still need to act. Once we're "done" we flip to showing the envelope's documents which have the final
                  // field vales (so far) stamped into them.
                  // TODO: Confirm that a pure page-number match is good enough to find the matching template page. We need to make sure
                  //  we either don't reset our page numbers for additional attachments, or add match-on identifiers to work around that.
                  // console.log('tp', templatePage, page);
                  return (
                    <verdocs-envelope-document-page
                      id={`page-${globalPageCounter}`}
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
            onNext={() => {
              this.isDone = true;
              this.showFinishLater = false;
            }}
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

        {this.adoptingSignature && (
          <verdocs-adopt-signature-dialog
            name={formatFullName(this.recipient)}
            onNext={async e => {
              console.log('[SIGN] Adopting signature/initials block', e.detail);

              this.showSpinner = true;

              // These arrive as base-64 encoded data URLs
              const signatureBlob = await (await fetch(e.detail.signature)).blob();
              const initialsBlob = await (await fetch(e.detail.initials)).blob();

              const sigResult = await createSignature(this.endpoint, 'signature', signatureBlob);
              console.log('[SIGN] Created signature', sigResult);
              this.signatureId = sigResult.id;

              const initResult = await createInitials(this.endpoint, 'initial', initialsBlob);
              console.log('[SIGN] Created initials', initResult);
              this.initialId = initResult.id;

              this.showSpinner = false;
              this.adoptingSignature = false;

              // If we have a focused field, we should auto-apply the new signature/initials to it
              if (this.focusedField) {
                const field = this.getRecipientFields().find(f => f.name === this.focusedField);
                if (field) {
                  console.log('[SIGN] Auto-applying adopted signature to focused field', field.name);
                  if (field.type === 'signature') {
                    const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, this.signatureId, false);
                    this.updateRecipientFieldValue(field.name, updateResult);
                  } else if (field.type === 'initial') {
                    const updateResult = await updateEnvelopeField(this.endpoint, this.envelopeId, this.roleId, field.name, this.initialId, false);
                    this.updateRecipientFieldValue(field.name, updateResult);
                  }
                  this.checkRecipientFields();
                }
              }
            }}
            onExit={() => (this.adoptingSignature = false)}
          />
        )}

        {(this.submitting || this.showSpinner) && (
          <verdocs-portal>
            <div class="spinner-overlay">
              <verdocs-spinner />
            </div>
          </verdocs-portal>
        )}

        {this.showDownloadDialog && (
          <verdocs-download-dialog
            onExit={() => (this.showDownloadDialog = false)}
            onNext={async e => {
              this.showDownloadDialog = false;
              const {action} = e.detail;
              console.log('[SIGN] Download action selected:', action);

              try {
                if (action === 'document') {
                  // Download main document(s)
                  const attachments = this.envelope.documents.filter(d => d.type === 'attachment');
                  if (attachments.length === 1) {
                    const url = await getEnvelopeDocumentDownloadLink(this.endpoint, attachments[0].id);
                    window.open(url, '_blank');
                  } else {
                    // If multiple docs, we might want to zip them or just download the first one for now as per previous logic?
                    // The requirement says "Document", implies the PDF.
                    // Users might have multiple files though.
                    // For now let's just do the zip of everything if multiple? Or loop?
                    // Let's stick to the previous behavior "firstDoc" strategy if we can't do better,
                    // or use getEnvelopeDocumentDownloadLink for each?
                    // Best user experience for "Document" if multiple is probably just the first one or a zip of docs.
                    // But "All Files" covers zip.
                    // Let's assume the main document is the primary intent.
                    const firstDoc = attachments[0];
                    if (firstDoc) {
                      const url = await getEnvelopeDocumentDownloadLink(this.endpoint, firstDoc.id);
                      window.open(url, '_blank');
                    }
                  }
                } else if (action === 'certificate') {
                  const cert = this.envelope.documents.find(d => d.type === 'certificate');
                  if (cert) {
                    const url = await getEnvelopeDocumentDownloadLink(this.endpoint, cert.id);
                    window.open(url, '_blank');
                  } else {
                    VerdocsToast('Certificate not yet available.', {style: 'info'});
                  }
                } else if (action === 'zip') {
                  // The helper in verdocs-view used getEnvelopesZip with an array
                  const blob = await getEnvelopesZip(this.endpoint, [this.envelopeId]);
                  const url = window.URL.createObjectURL(blob.data);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${this.envelope.name}.zip`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                }
              } catch (err) {
                console.error('Download error', err);
                VerdocsToast('Unable to complete download request.', {style: 'error'});
              }
            }}
          />
        )}

        {!this.loading && !this.isDone && (
          <verdocs-sign-footer
            endpoint={this.endpoint}
            envelopeId={this.envelopeId}
            isDone={this.isDone}
            onAskQuestion={(e: any) => {
              askQuestion(this.endpoint, this.envelopeId, this.roleId, {question: e.detail.question})
                .then(() => VerdocsToast('Your question has been sent.', {style: 'success'}))
                .catch(e => {
                  console.log('Error asking question', e);
                  VerdocsToast('Unable to send question, please try again later.', {style: 'error'});
                });
            }}
            onDecline={() => (this.declining = true)}
            onFinishLater={() => (this.showFinishLater = true)}
          />
        )}
      </Host>
    );
  }
}
