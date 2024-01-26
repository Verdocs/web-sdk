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

export interface IPageLayer {
  name: string;
  type: 'div' | 'canvas';
}

export const FORMAT_TIMESTAMP = 'P pp';
// export const FORMAT_TIMESTAMP = 'Y-MM-dd hh:mm:ss a';
export const FORMAT_DATE = 'Y-MM-dd'
