export interface IDocumentPageInfo {
  containerId: string;
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
