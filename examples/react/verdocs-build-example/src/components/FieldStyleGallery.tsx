import type {ReactNode} from 'react';
import {
  VerdocsFieldDate,
  VerdocsFieldDropdown,
  VerdocsFieldInitial,
  VerdocsFieldSignature,
} from '@verdocs/web-sdk-react';

const DEMO_SOURCE_ID = '00000000-0000-4000-8000-000000000001';

interface GalleryItemProps {
  title: string;
  hint: string;
  signerClass: string;
  children: ReactNode;
}

const GalleryItem = ({title, hint, signerClass, children}: GalleryItemProps) => (
  <div className={`field-gallery-item ${signerClass}`}>
    <h3>{title}</h3>
    <p className="field-hint">{hint}</p>
    <div className="field-gallery-preview">{children}</div>
  </div>
);

export const FieldStyleGallery = () => (
  <div className="field-gallery">
    <GalleryItem
      title="Signature"
      hint="Uses --verdocs-field-background, --verdocs-field-border, --verdocs-field-radius. Recipient tint via .signer-N and --signer-N-color."
      signerClass="signer-1"
    >
      <VerdocsFieldSignature
        source="template"
        sourceid={DEMO_SOURCE_ID}
        fieldname="demo-signature"
        name="Demo Signer"
        disabled={false}
        editable={false}
        moveable={false}
        done={false}
      />
    </GalleryItem>

    <GalleryItem
      title="Initials"
      hint="Same field chrome variables as signature; initials dialog uses global --verdocs-dialog-* tokens."
      signerClass="signer-2"
    >
      <VerdocsFieldInitial
        source="template"
        sourceid={DEMO_SOURCE_ID}
        fieldname="demo-initial"
        disabled={false}
        editable={false}
        moveable={false}
        done={false}
      />
    </GalleryItem>

    <GalleryItem
      title="Date"
      hint="Field input uses --verdocs-field-*; calendar popup uses --adp-accent-color and related --adp-* variables on .air-datepicker."
      signerClass="signer-3"
    >
      <VerdocsFieldDate
        source="template"
        sourceid={DEMO_SOURCE_ID}
        fieldname="demo-date"
        disabled={false}
        editable={false}
        moveable={false}
        done={false}
      />
    </GalleryItem>

    <GalleryItem
      title="Dropdown (select)"
      hint="Native select styling via --verdocs-field-text-color and --verdocs-field-border on the signing field."
      signerClass="signer-1"
    >
      <VerdocsFieldDropdown
        source="template"
        sourceid={DEMO_SOURCE_ID}
        fieldname="demo-dropdown"
        disabled={false}
        editable={false}
        moveable={false}
        done={false}
      />
    </GalleryItem>
  </div>
);
