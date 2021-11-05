import {Component, Host, h, State, Event, EventEmitter} from '@stencil/core';
import SearchIcon from './search.svg';

export type TContentType = 'all' | 'document' | 'template' | 'organization';

export interface ISearchEvent {
  q: string;
  type: TContentType;
}

@Component({
  tag: 'search-box',
  styleUrl: 'search-box.scss',
})
export class SearchBox {
  @State() q: string;

  /**
   * Event fired when the query value has changed.
   */
  @Event({composed: true}) search: EventEmitter<ISearchEvent>;

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.q);
    this.search.emit({type: 'all', q: this.q});
  }

  handleChange(event) {
    this.q = event.target.value;
  }

  render() {
    return (
      <Host>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="text" placeholder="search documents, templates, people..." value={this.q} onInput={e => this.handleChange(e)} />
          <button onClick={e => this.handleSubmit(e)}>
            <span innerHTML={SearchIcon} />
            Search
          </button>
        </form>
      </Host>
    );
  }
}
