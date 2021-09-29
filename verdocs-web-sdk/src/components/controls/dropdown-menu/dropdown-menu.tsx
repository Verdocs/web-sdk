import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';
import SortDown from './down-arrow.svg';

export interface IMenuOption {
  label: string;
  id?: any;
  faIcon?: any;
  disabled?: boolean;
}

/**
 * Display a drop-down menu button. A menu of the specified options will be displayed when the button is pressed. The menu will be hidden
 * when the button is pressed again, or an option is selected.
 *
 * ```typescript
 * interface IMenuOption {
 *   // The label to display on the menu option.
 *   label: string;
 *   // Optional icon to display next to the option's label. Specify icons as SVG strings.
 *   icon?: string;
 *   // If true, the option will be shown disabled (dimmed and not clickable).
 *   disabled?: boolean;
 *   // Optional additional fields such as IDs or other data. When a menu option is clicked/tapped, the associated
 *   // IMenuOptionwill be passed to the event handler. This data may be used to help identify the option selected.
 *   [key: string]: any;
 * }
 * ```
 */
@Component({
  tag: 'dropdown-menu',
  styleUrl: 'dropdown-menu.css',
  shadow: true,
})
export class DropdownMenu {
  /**
   * The menu options to display.
   */
  @Prop() options: IMenuOption[] = [];

  /**
   * If set, the component will belopen by default. This is primarily intended to be used for testing.
   */
  @Prop() open: boolean;

  /**
   * If set, the component will reserve space for Storybook-display purposes.
   */
  @Prop() tall: boolean;

  /**
   * If set, the component will be open by default.
   */
  @State() isOpen: boolean;

  /**
   * Event fired when a menu option is clicked.
   */
  @Event() optionSelected: EventEmitter<IMenuOption> = null;

  componentWillLoad() {
    this.isOpen = !!this.open;
  }

  handleSelectOption(option: IMenuOption) {
    this.isOpen = false;
    this.optionSelected?.emit(option);
  }

  render() {
    return (
      <div class={{open: !!this.isOpen}}>
        <button class="arrow" innerHTML={SortDown} onClick={() => (this.isOpen = !this.isOpen)} aria-label="Open Menu" />

        <div class="items" aria-hidden={!this.isOpen}>
          {this.options?.map(option => (
            <button onClick={() => this.handleSelectOption(option)} class="option" disabled={option.disabled}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
}
