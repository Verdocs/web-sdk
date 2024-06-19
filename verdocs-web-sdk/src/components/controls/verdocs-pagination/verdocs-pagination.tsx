import {integerSequence} from '@verdocs/js-sdk';
import {Host, FunctionalComponent} from '@stencil/core';
import {Component, Prop, Element, h, Event, EventEmitter} from '@stencil/core';

const ChevronDoubleLeft = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></svg>`;

const ChevronDoubleRight = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>`;

type TPageNumber = number | 'first' | 'last';

const VISIBLE_PAGES = 5;

const PageButton: FunctionalComponent<{page: TPageNumber; selected: number; onClick: (page: TPageNumber) => void}> = ({page, selected, onClick}) => {
  let label;
  if (page === 'first') {
    label = ChevronDoubleLeft;
  } else if (page === 'last') {
    label = ChevronDoubleRight;
  } else {
    label = String(page + 1);
  }

  return <div class={`page-button ${page === selected ? 'selected' : ''}`} onClick={() => onClick(page)} innerHTML={label} />;
};

@Component({
  tag: 'verdocs-pagination',
  styleUrl: 'verdocs-pagination.scss',
})
export class VerdocsQuickFilter {
  @Element()
  el: HTMLElement;

  /**
   * The currently selected page.
   */
  @Prop({mutable: true, reflect: true}) selectedPage: number = 0;

  /**
   * The total number of items.
   */
  @Prop() itemCount: number = 1;

  /**
   * The number of displayed per page.
   */
  @Prop() perPage: number = 10;

  /**
   * Event fired when the selected page changes. The new page number is included in the event.
   */
  @Event({composed: true}) selectPage: EventEmitter<{selectedPage: number}>;

  handleSelectPage(page: number) {
    this.selectedPage = page;
    this.selectPage?.emit({selectedPage: page});
  }

  render() {
    const firstPage = Math.max(0, this.selectedPage - 2);
    const numPages = this.itemCount > 0 ? Math.ceil(this.itemCount / this.perPage) : 0;
    const pagesToDisplay = integerSequence(0, Math.ceil(this.itemCount / this.perPage)).slice(firstPage, firstPage + VISIBLE_PAGES);

    return (
      <Host>
        {this.selectedPage > 0 && <PageButton page={'first'} selected={this.selectedPage} onClick={() => this.handleSelectPage(0)} />}

        {firstPage > 0 && <div class="ellipsis">...</div>}

        {pagesToDisplay.map(pageNumber => (
          <PageButton page={pageNumber} selected={this.selectedPage} onClick={page => this.handleSelectPage(+page)} />
        ))}

        {this.selectedPage < numPages - 1 && <div class="ellipsis">...</div>}

        {this.selectedPage < numPages - 1 && <PageButton page={'last'} selected={this.selectedPage} onClick={() => this.handleSelectPage(numPages - 1)} />}
      </Host>
    );
  }
}
