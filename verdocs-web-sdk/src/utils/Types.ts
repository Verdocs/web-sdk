export interface IDocumentPageInfo {
  containerId: string;
  documentId: string;
  pageNumber: number;
  virtualWidth: number;
  virtualHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number;
  xScale: number;
  yScale: number;
}

// Where one of the signer's fields should have appeared, for tracking down fields that don't draw. Never includes values.
export interface IFieldNotVisible {
  problem: 'not drawn' | 'never drawn' | 'missing after render' | 'no page' | 'no size' | 'off the page';
  envelope_id: string;
  organization_id: string;
  role_name: string;
  field: {name: string; type: string; page: number; x: number; y: number; width: number; height: number};
  page: {width: number; height: number; rendered_width: number; rendered_height: number} | null;
}

export interface IPageLayer {
  name: string;
  type: 'div' | 'canvas';
}

export const FORMAT_TIMESTAMP = 'P pp';
// export const FORMAT_TIMESTAMP = 'Y-MM-dd hh:mm:ss a';
export const FORMAT_DATE = 'P';
// export const FORMAT_DATE = 'y-MM-dd'

export const DownloadAction = {
  document: 'document',
  certificate: 'certificate',
  zip: 'zip',
  combined: 'combined',
} as const;

export type DownloadAction = (typeof DownloadAction)[keyof typeof DownloadAction];

export interface IDownloadEvent {
  action: DownloadAction;
  documentId?: string;
}
