import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';
import SortDown from './down-arrow.svg';
// import {icon} from '@fortawesome/fontawesome-svg-core';
// <div className="arrow" innerHTML={icon({ prefix: 'fas', iconName: 'sort-down' }).html[0]}/>

export interface IMenuOption {
  label: string;
  id?: any;
  faIcon?: any;
  disabled?: boolean;
}

@Component({
  tag: 'dropdown-menu',
  styleUrl: 'dropdown-menu.css',
  shadow: true,
})
export class DropdownMenu {
  /**
   * The menu options to display
   */
  @Prop() options: IMenuOption[];

  /**
   * If set, the component will be open by default
   */
  @Prop() open: boolean;

  /**
   * If set, the component will be open by default
   */
  @State() isOpen: boolean;

  /**
   * Called when a menu option is clicked
   */
  @Event() selectOption: EventEmitter<IMenuOption>;

  componentWillLoad() {
    this.isOpen = !!this.open;
  }

  render() {
    return (
      <div class={{open: !!this.isOpen}}>
        <button class="arrow" innerHTML={SortDown} onClick={() => (this.isOpen = !this.isOpen)} aria-label="Open Menu" />

        <div class="items">
          {this.options?.map(option => (
            <button onClick={() => this.selectOption.emit(option)} class="item" disabled={option.disabled}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
}
