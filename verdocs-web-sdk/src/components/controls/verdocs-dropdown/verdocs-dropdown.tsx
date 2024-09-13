import {Host, State} from '@stencil/core';
import {randomString} from '@verdocs/js-sdk';
import {Component, Prop, Element, h, Event, EventEmitter} from '@stencil/core';

const DropdownArrow = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#50BE80"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>`;

export interface IMenuOption {
  label: string;
  id?: any;
  faIcon?: any;
  disabled?: boolean;
}

/**
 * Display a drop-down menu button. A menu of the specified options will be displayed when the button is pressed. The menu will be hidden
 * when the button is pressed again, or an option is selected. Separators may be created by supplying an entry with an empty label.
 *
 * ```ts
 * <verdocs-dropdown
 *   options={[
 *     {label: 'Option 1', disabled: true},
 *     {label: 'Option 2', id: '2'}
 *     {label: ''}
 *     {label: 'Option 3', id: '2'}
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

  /**
   * The menu options to display.
   */
  @Prop() options: IMenuOption[] = [];

  /**
   * Event fired when a menu option is clicked.
   * Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks.
   */
  @Event({composed: true}) optionSelected: EventEmitter<IMenuOption>;

  @State() containerId = `verdocs-send-${Math.random().toString(36).substring(2, 11)}`;

  @State() showPicker = false;

  handleSelectOption(e: any, option: IMenuOption) {
    e.stopPropagation();
    this.optionSelected?.emit(option);
    this.showPicker = false;
  }

  toggle() {
    this.showPicker = !this.showPicker;
  }

  render() {
    const elId = `verdocs-dropdown-${randomString(8)}`;

    return (
      <Host>
        <button class="arrow" innerHTML={DropdownArrow} aria-label="Open Menu" id={elId} onClick={() => (this.showPicker = !this.showPicker)} />

        {this.showPicker && (
          <verdocs-portal anchor={elId} onClickAway={() => (this.showPicker = false)} id="verdocs-dropdown-menu-items">
            {this.options.map(option => {
              if (!option.label) {
                return <div class="verdocs-dropdown-menu-separator" />;
              } else {
                return (
                  <button class="verdocs-dropdown-menu-option" disabled={option.disabled || false} onClick={e => this.handleSelectOption(e, option)}>
                    {option.label}
                  </button>
                );
              }
            })}
          </verdocs-portal>
        )}
      </Host>
    );
  }
}
