import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';
import SortDown from './down-arrow.svg';
import {createPopper, Instance} from '@popperjs/core';

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
  private dropdownButton?: HTMLButtonElement;
  private dropdownMenu?: HTMLDivElement;
  private popper?: Instance;

  /**
   * The menu options to display.
   */
  @Prop() options: IMenuOption[] = [];

  /**
   * If set, the component will be open by default. This is primarily intended to be used for testing.
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

  componentDidLoad() {
    this.popper = createPopper(this.dropdownButton, this.dropdownMenu, {placement: 'bottom-start', modifiers: [{name: 'offset', options: {offset: [0, 10]}}]});
  }

  handleSelectOption(option: IMenuOption) {
    this.isOpen = false;
    this.optionSelected?.emit(option);
  }

  // See https://popper.js.org/docs/v2/tutorial/
  // What we're doing here is clearing event listeners when they aren't needed, to increase performance in lists
  showDropdown() {
    this.isOpen = true;
    this.dropdownMenu.setAttribute('data-show', '');
    this.dropdownMenu.removeAttribute('aria-hidden');

    this.popper?.setOptions(options => ({
      ...options,
      modifiers: [...options.modifiers, {name: 'eventListeners', enabled: true}],
    }));

    this.popper?.update();
  }

  hideDropdown() {
    this.isOpen = false;
    this.dropdownMenu.removeAttribute('data-show');
    this.dropdownMenu.setAttribute('aria-hidden', 'true');
    this.popper?.setOptions(options => ({
      ...options,
      modifiers: [...options.modifiers, {name: 'eventListeners', enabled: false}],
    }));
  }

  toggleDropdown() {
    if (this.isOpen) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
  }

  render() {
    return (
      <div class={{open: !!this.isOpen}}>
        <button
          class="arrow"
          innerHTML={SortDown}
          aria-label="Open Menu"
          onClick={() => this.toggleDropdown()}
          onBlur={() => this.hideDropdown()}
          ref={el => (this.dropdownButton = el as HTMLButtonElement)}
        />

        <div class="items" aria-hidden={!this.open} ref={el => (this.dropdownMenu = el as HTMLDivElement)}>
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
