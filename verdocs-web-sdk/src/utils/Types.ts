export interface IDocumentPageInfo {
  container: HTMLElement;
  containerId: string;
  pageNumber: number;
  virtualWidth: number;
  virtualHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  naturalWidth: number;
  naturalHeight: number;
  xScale: number;
  yScale: number;
}

export interface IPageLayer {
  name: string;
  type: 'div' | 'canvas';
}
