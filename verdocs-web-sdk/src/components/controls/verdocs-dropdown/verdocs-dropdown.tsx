import {Host, Listen} from '@stencil/core';
import {Component, Prop, Element, h, Event, EventEmitter} from '@stencil/core';

const MENU_ID = 'verdocs-dropdown-menu-items';

const DropdownArrow = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#50BE80"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>`;

export interface IMenuOption {
  label: string;
  id?: any;
  faIcon?: any;
  disabled?: boolean;
}

function debounce(func: () => void, wait: number, immediate?: any) {
  let timeout;

  return function () {
    const context = this,
      args = arguments;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

@Component({
  tag: 'verdocs-dropdown',
  styleUrl: 'verdocs-dropdown.scss',
})
export class VerdocsDropdown {
  @Element()
  el: HTMLElement;

  private dropdownButton?: HTMLButtonElement;

  /**
   * The menu options to display.
   */
  @Prop() options: IMenuOption[] = [];

  /**
   * Event fired when a menu option is clicked.
   * Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks.
   */
  @Event({composed: true}) optionSelected: EventEmitter<IMenuOption>;

  // TODO: This isn't super efficient but it works for now
  @Listen('resize', {target: 'window'})
  handleResize() {
    debounce(this.repositionDropdown.bind(this), 100);
  }

  handleSelectOption(e: any, option: IMenuOption) {
    e.stopPropagation();
    this.optionSelected?.emit(option);
    this.hide();
  }

  repositionDropdown() {
    const menu = document.getElementById(MENU_ID);
    if (menu) {
      const bodyWidth = document.body.scrollWidth;
      const buttonRect = this.dropdownButton?.getBoundingClientRect();
      const triggerHeight = this.dropdownButton?.offsetWidth || 28;
      console.log('Repositioning dropdown', {bodyWidth, buttonRect, triggerHeight}, menu);

      menu.style.top = `${(buttonRect?.top || 0) + triggerHeight}px`;
      menu.style.right = `${Math.max(0, bodyWidth - (buttonRect?.right || 0))}px`;
    }
  }

  // See https://popper.js.org/docs/v2/tutorial/
  // What we're doing here is clearing event listeners when they aren't needed, to increase performance in lists
  showDropdown() {
    this.hide();

    const menu = document.createElement('div');
    menu.id = MENU_ID;

    this.options.forEach(option => {
      if (!option.label) {
        const separator = document.createElement('div');
        separator.className = 'verdocs-dropdown-menu-separator';
        menu.appendChild(separator);
      } else {
        const button = document.createElement('button');
        button.className = 'verdocs-dropdown-menu-option';
        button.disabled = option.disabled || false;
        button.innerHTML = option.label;
        button.addEventListener('click', e => this.handleSelectOption(e, option));
        menu.appendChild(button);
      }
    });

    document.body.appendChild(menu);
    setTimeout(this.repositionDropdown.bind(this), 50);
  }

  toggle(e: any) {
    e.stopPropagation();

    if (document.getElementById(MENU_ID)) {
      this.hide();
    } else {
      this.showDropdown();
    }
  }

  hide() {
    document.getElementById(MENU_ID)?.remove();
  }

  render() {
    return (
      <Host>
        <button
          class="arrow"
          innerHTML={DropdownArrow}
          aria-label="Open Menu"
          onClick={e => this.toggle(e)}
          // onBlur={() => this.hide()}
          ref={el => (this.dropdownButton = el as HTMLButtonElement)}
        />
      </Host>
    );
  }
}
