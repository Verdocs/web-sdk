import {Component, Host, h, State, Event, EventEmitter, Prop} from '@stencil/core';
import SearchIcon from './search.svg';
import CloseIcon from './close.svg';

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
  @Prop() type: TContentType = 'all';

  @State() q: string;

  /**
   * Event fired when the query value has changed.
   */
  @Event({composed: true}) search: EventEmitter<ISearchEvent>;

  handleSubmit(e) {
    e.preventDefault();
    this.search.emit({type: this.type, q: this.q});
  }

  handleChange(event) {
    this.q = event.target.value;
  }

  render() {
    return (
      <Host>
        <form onSubmit={e => this.handleSubmit(e)}>
          {this.type !== undefined && this.type !== 'all' && (
            <span class="type">
              {this.type}s <button class="remove" innerHTML={CloseIcon} />
            </span>
          )}
          <input type="text" placeholder="search documents, templates, people..." value={this.q} onInput={e => this.handleChange(e)} />
          <button onClick={e => this.handleSubmit(e)} class="search">
            <span innerHTML={SearchIcon} />
            Search
          </button>
        </form>
      </Host>
    );
  }
}
