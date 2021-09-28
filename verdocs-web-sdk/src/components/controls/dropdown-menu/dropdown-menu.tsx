import {Component, Prop, h, Event, EventEmitter} from '@stencil/core';
import {icon} from '@fortawesome/fontawesome-svg-core';

export interface MenuOption {
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
  @Prop() options: MenuOption[];

  /**
   *
   */
  @Event() selectOption: EventEmitter<MenuOption>;

  render() {
    return (
      <div>
        <div class="arrow" innerHTML={icon({prefix: 'fas', iconName: 'sort-down'}).html[0]} />
        {this.options.map(option => (
          <div onClick={() => this.selectOption.emit(option)}>{option.label}</div>
        ))}
      </div>
    );
  }
}
