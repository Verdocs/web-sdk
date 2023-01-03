import {Host} from '@stencil/core';
import {createPopper, Instance} from '@popperjs/core';
import {Component, Prop, Element, State, h, Event, EventEmitter} from '@stencil/core';
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
 * ```html
 * <verdocs-dropdown
 *   options={[
 *     {label: 'Option 1', disabled: true},
 *     {label: 'Option 2', id: '2'}
 *    ]}
 *   label="OK" onClick={() => (console.log('OK clicked'))}
 * />
 * ```
 */
@Component({
  tag: 'verdocs-dropdown',
  styleUrl: 'verdocs-dropdown.scss',
})
export class VerdocsDropdown {
  @Element()
  el: HTMLElement;

  private dropdownButton?: HTMLButtonElement;
  private dropdownMenu?: HTMLDivElement;
  private popper?: Instance;

  /**
   * The menu options to display.
   */
  @Prop() options: IMenuOption[] = [];

  /**
   * Event fired when a menu option is clicked.
   * Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks.
   */
  @Event({composed: true}) optionSelected: EventEmitter<IMenuOption>;

  @State() open: boolean;

  // We need to do this to reliably disconnect the click-away listener
  clickListenerSymbol = new AbortController();
  componentDidLoad() {
    this.popper = createPopper(this.dropdownButton, this.dropdownMenu, {placement: 'bottom-start', modifiers: [{name: 'offset', options: {offset: [0, 6]}}]});

    window.addEventListener('click', this.clickListener.bind(this), {signal: this.clickListenerSymbol.signal});
  }

  disconnectedCallback() {
    this.clickListenerSymbol.abort();
  }

  clickListener(e: any) {
    const outside = !(e.target == this.el || this.el.contains(e.target));
    if (outside) {
      this.hide();
    }
  }

  handleSelectOption(e: any, option: IMenuOption) {
    e.stopPropagation();
    // this.isOpen = false;
    this.optionSelected.emit(option);
    this.hide();
  }

  // See https://popper.js.org/docs/v2/tutorial/
  // What we're doing here is clearing event listeners when they aren't needed, to increase performance in lists
  showDropdown() {
    // this.isOpen = true;
    this.dropdownMenu.setAttribute('data-show', '');
    this.dropdownMenu.removeAttribute('aria-hidden');

    this.popper
      ?.setOptions(options => ({
        ...options,
        modifiers: [...options.modifiers, {name: 'eventListeners', enabled: true}],
      }))
      .catch(() => {});

    this.popper?.update().catch(() => {});
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

    if (this.open) {
      this.hide();
    } else {
      this.showDropdown();
    }
  }

  hide() {
    this.open = false;
    this.dropdownMenu.removeAttribute('data-show');
    this.dropdownMenu.setAttribute('aria-hidden', 'true');
    this.popper
      ?.setOptions(options => ({
        ...options,
        modifiers: [...options.modifiers, {name: 'eventListeners', enabled: false}],
      }))
      .catch(() => {});
  }

  render() {
    return (
      <Host class={{open: !!this.open}}>
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
