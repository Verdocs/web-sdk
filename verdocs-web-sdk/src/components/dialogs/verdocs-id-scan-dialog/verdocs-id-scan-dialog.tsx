import {Component, Host, Prop, h, Event, EventEmitter, State} from '@stencil/core';
import {IRecipient, ISignerTokenResponse, VerdocsEndpoint} from '@verdocs/js-sdk';
import {CheckCircleIcon, SelfieIcon} from '../../../utils/Icons';

// TODO: Replace these with js-sdk imports
type TScanDocumentType = 'driverLicense' | 'idCard' | 'passport';
type TImageUpload = 'front_image' | 'back_image' | 'face_image';
type TScanBadImageError =
  | 'Image Too Small'
  | 'Document Missing Four Corners'
  | 'Document Too Small'
  | 'Document Border Too Small'
  | 'Face Image Not Detected'
  | 'Barcode Not Detected'
  | 'Image Error'
  | 'Document is Skewed'
  | 'Image same as Document Image';

// Why a photo needs retaking. GBG's names, plus "Image Too Large" from the API's own checks.
type TIdImageError = TScanBadImageError | 'Image Too Large';

// One entry in the API's `images` list when code is "id_retake"
interface IIdImageErrors {
  image: TImageUpload;
  errors: TIdImageError[];
}

type TStepStatus = 'intro' | 'document' | 'capture' | 'review' | 'submitting';

const SLOTS_BY_TYPE: Record<TScanDocumentType, TImageUpload[]> = {
  driverLicense: ['front_image', 'back_image', 'face_image'],
  idCard: ['front_image', 'back_image', 'face_image'],
  passport: ['front_image', 'face_image'],
};

const SLOT_LABELS: Record<TImageUpload, string> = {
  front_image: 'Front',
  back_image: 'Back',
  face_image: 'Selfie',
};

// Why a photo needs retaking, in words the signer can act on. The API always sends the documented spelling. Anything
// not listed (e.g. a new error from a newer API) is shown as-is.
const RETAKE_MESSAGES: Record<TIdImageError, string> = {
  'Face Image Not Detected': "We couldn't find the photo of your face on your ID. Make sure it's in focus and well lit.",
  'Barcode Not Detected': "We couldn't read the barcode. Make sure it's in focus, well lit, and not covered.",
  'Image same as Document Image': 'This is the same photo as the front of your ID. Please take a selfie.',
  'Image Too Small': "This photo is too small. Please retake it with your phone's camera.",
  'Document Missing Four Corners': 'Make sure all four corners of your ID are in the photo.',
  'Document Too Small': 'Your ID is too small in the photo. Move the camera closer.',
  'Document Border Too Small': 'Leave a little dark background showing around every edge of your ID.',
  'Image Error': "This photo is blurry, has glare, or couldn't be read. Please retake it.",
  'Document is Skewed': 'Your ID is rotated in the photo. Hold the camera straight above it.',
  'Image Too Large': 'This photo is too large. Please retake it.',
};

const describeIdError = (error: TIdImageError) => RETAKE_MESSAGES[error] || error;

const IdCardIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#E8ECFC"/><g stroke="#4A68DD" stroke-linecap="round" stroke-linejoin="round"><rect x="8.5" y="9.5" width="15" height="13" rx="1.5"/><path d="M8.5 12.5h15M17 15.5h3.5M17 17.5h2"/></g><g fill="#4A68DD"><circle cx="13" cy="15.25" r="1.25"/><path d="M10.75 19.25c0-1.2 1-2 2.25-2s2.25.8 2.25 2z"/></g></svg>`;
const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#888"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`;

interface IAuthenticateRecipientViaIdRequest {
  auth_method: 'id';
  country_code: string; // ISO 3166 alpha-3
  document_type: TScanDocumentType;
  front_image: Blob;
  back_image?: Blob;
  face_image: Blob;
}

interface IDocumentTypeOption {
  label: string;
  value: TScanDocumentType;
}

const typeOptions: IDocumentTypeOption[] = [
  {label: 'Drivers License', value: 'driverLicense'},
  {label: 'ID Card', value: 'idCard'},
  {label: 'Passport', value: 'passport'},
];

// TODO: Import from js-sdk
const verifySignerId = (endpoint: VerdocsEndpoint, params: IAuthenticateRecipientViaIdRequest) => {
  const formData = new FormData();
  formData.append('auth_method', 'id');
  formData.append('country_code', params.country_code);
  formData.append('document_type', params.document_type);
  formData.append('front_image', params.front_image, 'front.jpg');
  if (params.back_image) formData.append('back_image', params.back_image, 'back.jpg');
  if (params.face_image) formData.append('face_image', params.face_image, 'face.jpg');

  // Upload plus GBG's synchronous processing can exceed the 60s default
  return endpoint.api.post<ISignerTokenResponse>(`/v2/sign/verify`, formData, {timeout: 120000}).then(r => r.data);
};

@Component({
  tag: 'verdocs-id-scan-dialog',
  styleUrl: 'verdocs-id-scan-dialog.scss',
})
export class VerdocsIdScanDialog {
  @Prop({mutable: true}) endpoint: VerdocsEndpoint = new VerdocsEndpoint({sessionType: 'signing'});
  @Event({composed: true}) next: EventEmitter<{response: ISignerTokenResponse}>;
  @Event({composed: true}) exit: EventEmitter;
  @Event({composed: true}) verificationFailed: EventEmitter<{message: string}>;

  /**
   * For identity confirmation, the current recipient details.
   */
  @Prop() recipient: IRecipient | null = null;

  @State() updatedRecipient: IRecipient = null;

  @State() step: TStepStatus = 'intro';
  @State() countryCode = 'USA';
  @State() documentType: TScanDocumentType = 'driverLicense';
  @State() slotIndex = 0;
  @State() images: Partial<Record<TImageUpload, File>> = {};
  @State() previews: Partial<Record<TImageUpload, string>> = {};
  @State() error: string | null = null;
  @State() fieldErrors: Partial<Record<TImageUpload, string[]>> = {};

  fileInputs: Partial<Record<TImageUpload, HTMLInputElement>> = {};

  get slots(): TImageUpload[] {
    return [...SLOTS_BY_TYPE[this.documentType]];
  }

  // A photo with errors must be replaced before submitting. GBG returns the same errors if it gets the same photo again.
  get hasFieldErrors() {
    return Object.values(this.fieldErrors).some(errors => !!errors?.length);
  }

  componentWillLoad() {
    this.updatedRecipient = {...(this.recipient || {})} as IRecipient;
  }

  disconnectedCallback() {
    this.revokePreviews();
  }

  handleCancel() {
    this.exit.emit();
  }

  async handleSubmit() {
    const isDisabled = this.slots.some(slot => !this.images[slot]) || !!this.error || this.hasFieldErrors;
    if (isDisabled) return;

    this.step = 'submitting';
    this.error = null;
    this.fieldErrors = {};
    try {
      const response = await verifySignerId(this.endpoint, {
        auth_method: 'id',
        country_code: this.countryCode,
        document_type: this.documentType,
        front_image: this.images.front_image,
        back_image: this.images.back_image,
        face_image: this.images.face_image,
      });
      this.next.emit({response});
    } catch (e) {
      console.log('handleSubmit: Error occured', e);
      const data = e.response?.data;

      // The API or GBG couldn't use some photos. Show what's wrong under each one so the signer can retake them.
      if (data?.code === 'id_retake') {
        const fieldErrors: Partial<Record<TImageUpload, string[]>> = {};
        const general: string[] = [];
        const images: IIdImageErrors[] = data.images || [];

        images.forEach(({image, errors}) => {
          const messages = errors.map(describeIdError);
          // Only slots on screen can show errors, otherwise Submit would stay disabled with nothing to fix
          if (this.slots.includes(image)) {
            fieldErrors[image] = messages;
          } else {
            general.push(...messages);
          }
        });

        this.fieldErrors = fieldErrors;
        this.error = general.length > 0 ? general.join(' ') : this.hasFieldErrors ? null : "We couldn't read your ID. Please retake the photos.";
        this.step = 'capture';
        return;
      }

      const message = data?.error || 'Unable to verify your ID. Please try again.';
      if (message.includes('failed')) {
        // TODO: switch to a stable error code once the API has one
        this.verificationFailed.emit({message});
        return;
      }
      // Anything else (an outage, a timeout, a missing photo): keep country/type so the signer can try again
      this.error = message;
      // TODO: handle form validation
      // this.resetImages();
      this.step = 'capture';
    }
  }

  resetImages() {
    this.revokePreviews();
    this.previews = {};
    this.images = {};
    this.slotIndex = 0;
  }

  revokePreviews = () => {
    Object.values(this.previews).forEach(url => url && URL.revokeObjectURL(url));
  };

  setPreview = (slot: TImageUpload, file?: File) => {
    if (this.previews[slot]) URL.revokeObjectURL(this.previews[slot]);
    this.previews = {...this.previews, [slot]: file ? URL.createObjectURL(file) : undefined};
  };

  handleChoosePhoto(slot: TImageUpload) {
    const input = this.fileInputs[slot];
    // Clear first so choosing the same photo again still fires a change event
    input.value = '';
    input.click();
  }

  async handleFileSelected(slot: TImageUpload, input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    try {
      const blob = await normalizeIdImage(file, slot);
      const image = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {type: blob.type});
      this.images = {...this.images, [slot]: image};
      this.setPreview(slot, image);
      this.fieldErrors = {...this.fieldErrors, [slot]: undefined};
      this.error = null;
    } catch (e) {
      this.fieldErrors = {...this.fieldErrors, [slot]: [e.message]};
      this.images = {...this.images, [slot]: undefined};
      this.setPreview(slot);
    }
  }

  handleRemoveImage(slot: TImageUpload) {
    console.log('Should be removing this slot: ', slot);
    this.images = {...this.images, [slot]: undefined};
    this.previews = {...this.previews, [slot]: undefined};
  }

  handleSelectDocumentType(e: any) {
    this.documentType = e.target.value;
    // Photos taken for one document type can't be submitted as another
    this.resetImages();
    this.error = null;
    this.fieldErrors = {};
  }

  render() {
    const submitting = this.step === 'submitting';
    const isDisabled = submitting || this.slots.some(slot => !this.images[slot]) || !!this.error || this.hasFieldErrors;

    return (
      <Host>
        <verdocs-dialog persistent onExit={() => this.handleCancel()}>
          <div slot="heading" class="heading">
            <div class="title">ID Verification Required</div>
          </div>

          <div slot="content" class="content">
            <div class="help-box">
              <div class="help-details">
                <div class="help-text">
                  This document requires you to verify your identity with a photo ID. For best results, use your phone's camera, place your ID on a dark surface, and make sure all
                  four corners are visible.
                </div>
              </div>
            </div>

            <verdocs-select-input label="Document Type" options={typeOptions} value={this.documentType} disabled={submitting} onChange={e => this.handleSelectDocumentType(e)} />

            <div class="photos">
              {this.slots.map(slot => (
                <div class="photo-col" key={slot}>
                  <div class="photo-label">
                    {this.images[slot] && <span class="photo-check" innerHTML={CheckCircleIcon} />}
                    {SLOT_LABELS[slot]}
                  </div>

                  <div class={{'file-input-wrapper': true, 'has-error': !!this.fieldErrors[slot]?.length}}>
                    {this.images[slot] ? (
                      <div class="photo-icon">
                        <img class="photo-preview" src={this.previews[slot]} alt={SLOT_LABELS[slot]} />
                      </div>
                    ) : (
                      <div class="photo-icon" innerHTML={slot === 'face_image' ? SelfieIcon : IdCardIcon} />
                    )}
                    <div class="photo-info">
                      {this.images[slot] ? (
                        <div class="info-wrapper">
                          <span class="info-file-name">{this.images[slot].name}</span>
                          <span class="info-file-size">{formatFileSize(this.images[slot].size)}</span>
                        </div>
                      ) : (
                        <div class="file-placeholder-text">No photo added</div>
                      )}
                    </div>
                    <div class="photo-actions">
                      {this.images[slot] ? (
                        <div class="photo-actions-wrapper">
                          <verdocs-button class="replace-button" size="small" variant="text" label="Replace" disabled={submitting} onClick={() => this.handleChoosePhoto(slot)} />
                          <div class="trash-button" innerHTML={TrashIcon} onClickCapture={() => this.handleRemoveImage(slot)} />
                        </div>
                      ) : (
                        <verdocs-button
                          size="small"
                          variant="outline"
                          label={this.images[slot] ? 'Retake' : 'Add Photo'}
                          disabled={submitting}
                          onClick={() => this.handleChoosePhoto(slot)}
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        style={{display: 'none'}}
                        capture={slot === 'face_image' ? 'user' : 'environment'}
                        ref={el => (this.fileInputs[slot] = el as HTMLInputElement)}
                        onChange={(e: any) => this.handleFileSelected(slot, e.target)}
                      />
                    </div>
                  </div>

                  {!!this.fieldErrors[slot]?.length && (
                    <ul class="photo-errors">
                      {this.fieldErrors[slot].map(message => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {this.error && <div class="error">{this.error}</div>}
          </div>

          <div slot="footer" class="buttons footer">
            <verdocs-button label="Cancel" variant="outline" disabled={submitting} onClick={() => this.handleCancel()} />
            <verdocs-button label={submitting ? 'Verifying...' : 'Submit'} disabled={isDisabled} onClick={() => this.handleSubmit()} />
          </div>
        </verdocs-dialog>
      </Host>
    );
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MIN_LONG = 2048;
const MIN_SHORT = 1536;
const MAX_LONG = 4288;
const MAX_SHORT = 3216;

async function normalizeIdImage(file: File, slot: TImageUpload): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("We couldn't read that photo. Please try again.");
  });
  const long = Math.max(bitmap.width, bitmap.height);
  const short = Math.min(bitmap.width, bitmap.height);
  const isSelfie = slot === 'face_image';
  console.log({long, short});
  if (!isSelfie && (long < MIN_LONG || short < MIN_SHORT)) {
    throw new Error("That photo is too small. Please use your phone's camera.");
  }

  const scale = Math.min(1, MAX_LONG / long, MAX_SHORT / short);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Unable to process photo'))), 'image/jpeg', 0.92));
}
