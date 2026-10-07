import {Component, Host, Prop, h, Event, EventEmitter, State} from '@stencil/core';
import {IRecipient, ISignerTokenResponse, VerdocsEndpoint} from '@verdocs/js-sdk';
import {CheckCircleIcon} from '../../../utils/Icons';

type TDocType = 'driverLicense' | 'idCard' | 'passport';
type TSlot = 'front_image' | 'back_image' | 'face_image';
type TStepStatus = 'intro' | 'document' | 'capture' | 'review' | 'submitting';

const SLOTS_BY_TYPE: Record<TDocType, TSlot[]> = {
  driverLicense: ['front_image', 'back_image'],
  idCard: ['front_image', 'back_image'], // Server allows front-only, but GBG's own capture flow takes both
  passport: ['front_image'],
};

const SLOT_LABELS: Record<TSlot, string> = {
  front_image: 'Front of ID',
  back_image: 'Back of ID',
  face_image: 'Selfie',
};

interface IAuthenticateRecipientViaIdRequest {
  auth_method: 'id';
  country_code: string; // ISO 3166 alpha-3
  document_type: TDocType;
  front_image: Blob;
  back_image?: Blob;
  face_image?: Blob;
}

interface IDocumentTypeOption {
  label: string;
  value: TDocType;
}

const typeOptions: IDocumentTypeOption[] = [
  {label: 'Drivers License', value: 'driverLicense'},
  {label: 'ID Card', value: 'idCard'},
  {label: 'Passport', value: 'passport'},
];

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
  @Prop() requireSelfie = false;
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
  @State() documentType: TDocType = 'driverLicense';
  @State() slotIndex = 0;
  @State() images: Partial<Record<TSlot, Blob>> = {};
  @State() error: string | null = null;

  fileInputs: Partial<Record<TSlot, HTMLInputElement>> = {};

  get slots(): TSlot[] {
    return [...SLOTS_BY_TYPE[this.documentType], ...(this.requireSelfie ? (['face_image'] as TSlot[]) : [])];
  }

  componentWillLoad() {
    this.updatedRecipient = {...(this.recipient || {})} as IRecipient;
  }

  handleCancel() {
    this.exit.emit();
  }

  async handleSubmit() {
    this.step = 'submitting';
    this.error = null;
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
      const message = e.response?.data?.error || 'Unable to verify your ID. Please try again.';
      if (message.includes('failed')) {
        // TODO: switch to a stable error code once the API has one
        this.verificationFailed.emit({message});
        return;
      }
      // Bad Image Detection or size error: keep country/type, retake the photos
      this.error = message;
      this.resetImages();
      this.step = 'capture';
    }
  }

  resetImages() {
    this.images = {};
    this.slotIndex = 0;
  }

  handleChoosePhoto(slot: TSlot) {
    const input = this.fileInputs[slot];
    // Clear first so choosing the same photo again still fires a change event
    input.value = '';
    input.click();
  }

  async handleFileSelected(slot: TSlot, input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    try {
      const image = await normalizeIdImage(file);
      this.images = {...this.images, [slot]: image};
      this.error = null;
    } catch (e) {
      this.error = e.message;
      this.images = {...this.images, [slot]: undefined};
    }
  }

  handleSelectDocumentType(e: any) {
    this.documentType = e.target.value;
    // Photos taken for one document type can't be submitted as another
    this.resetImages();
    this.error = null;
  }

  render() {
    const submitting = this.step === 'submitting';
    const isDisabled = submitting || this.slots.some(slot => !this.images[slot]) || !!this.error;

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
                <div class="photo" key={slot}>
                  <div class="photo-label">
                    {this.images[slot] && <span class="photo-check" innerHTML={CheckCircleIcon} />}
                    {SLOT_LABELS[slot]}
                  </div>

                  <verdocs-button
                    size="small"
                    variant="outline"
                    label={this.images[slot] ? 'Retake' : 'Add Photo'}
                    disabled={submitting}
                    onClick={() => this.handleChoosePhoto(slot)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{display: 'none'}}
                    capture={slot === 'face_image' ? 'user' : 'environment'}
                    ref={el => (this.fileInputs[slot] = el as HTMLInputElement)}
                    onChange={(e: any) => this.handleFileSelected(slot, e.target)}
                  />
                </div>
              ))}
            </div>

            {this.error && <div class="error">{this.error}</div>}
          </div>

          <div style={{background: isDisabled ? 'lime' : 'purple'}} slot="footer" class="buttons footer">
            <verdocs-button label="Cancel" variant="outline" disabled={submitting} onClick={() => this.handleCancel()} />
            <verdocs-button label={submitting ? 'Verifying...' : 'Submit'} disabled={isDisabled} onClick={() => this.handleSubmit()} />
          </div>
        </verdocs-dialog>
      </Host>
    );
  }
}

const MIN_LONG = 2048;
const MIN_SHORT = 1536;
const MAX_LONG = 4288;
const MAX_SHORT = 3216;

async function normalizeIdImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("We couldn't read that photo. Please try again.");
  });
  const long = Math.max(bitmap.width, bitmap.height);
  const short = Math.min(bitmap.width, bitmap.height);
  if (long < MIN_LONG || short < MIN_SHORT) {
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
