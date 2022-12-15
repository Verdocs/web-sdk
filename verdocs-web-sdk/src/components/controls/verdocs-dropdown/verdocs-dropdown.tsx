import {Host} from '@stencil/core';
import {createPopper, Instance} from '@popperjs/core';
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
 */
@Component({
  tag: 'verdocs-dropdown',
  styleUrl: 'verdocs-dropdown.scss',
})
export class VerdocsDropdown {
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
   * If set, the component will be open by default.
   */
  @State() isOpen: boolean;

  /**
   * Event fired when a menu option is clicked.
   * Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks.
   */
  @Event({composed: true}) optionSelected: EventEmitter<IMenuOption>;

  componentWillLoad() {
    this.isOpen = !!this.open;
  }

  componentDidLoad() {
    this.popper = createPopper(this.dropdownButton, this.dropdownMenu, {placement: 'bottom-start', modifiers: [{name: 'offset', options: {offset: [0, 6]}}]});
  }

  handleSelectOption(e: any, option: IMenuOption) {
    e.stopPropagation();
    this.isOpen = false;
    this.optionSelected.emit(option);
    this.hide();
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

  handleHideDropdown(e: any) {
    if (e?.target?.localName === 'button' && e?.target?.className === 'arrow') {
      // This event is fired when a menu element is clicked because the button "loses focus" then too
      return;
    }

    this.hide();
  }

  toggleDropdown(e: any) {
    e.stopPropagation();

    if (this.isOpen) {
      this.hide();
    } else {
      this.showDropdown();
    }
  }

  hide() {
    this.isOpen = false;
    this.dropdownMenu.removeAttribute('data-show');
    this.dropdownMenu.setAttribute('aria-hidden', 'true');
    this.popper?.setOptions(options => ({
      ...options,
      modifiers: [...options.modifiers, {name: 'eventListeners', enabled: false}],
    }));
  }

  render() {
    return (
      <Host class={{storybook: !!window?.['STORYBOOK_ENV'], open: !!this.isOpen}}>
        <button
          class="arrow"
          innerHTML={SortDown}
          aria-label="Open Menu"
          onClick={e => this.toggleDropdown(e)}
          onBlur={e => this.handleHideDropdown(e)}
          ref={el => (this.dropdownButton = el as HTMLButtonElement)}
        />

        <div class="items" aria-hidden={!this.open} ref={el => (this.dropdownMenu = el as HTMLDivElement)}>
          {this.options?.map(option => (
            <button onClick={e => this.handleSelectOption(e, option)} class="option" disabled={option.disabled}>
              {option.label}
            </button>
          ))}
        </div>
      </Host>
    );
  }
}
