import {Host} from '@stencil/core';
import {createPopper, Instance} from '@popperjs/core';
import {Component, Prop, Element, State, h, Event, EventEmitter} from '@stencil/core';

const DropdownArrow = `<svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-8mmkcg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>`;

export interface IFilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Display a drop-down menu of quick filter options.
 */
@Component({
  tag: 'verdocs-quick-filter',
  styleUrl: 'verdocs-quick-filter.scss',
})
export class VerdocsQuickFilter {
  @Element()
  el: HTMLElement;

  private dropdownButton?: HTMLElement;
  private dropdownMenu?: HTMLDivElement;
  private popper?: Instance;

  /**
   * The menu options to display.
   */
  @Prop() options: IFilterOption[] = [];

  @Prop({reflect: true})
  label: string = 'Filter';

  @Prop({reflect: true})
  value: string = '';

  @Prop({reflect: true})
  placeholder: string = 'Select...';

  /**
   * Event fired when a menu option is clicked.
   * Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks.
   */
  @Event({composed: true}) optionSelected: EventEmitter<IFilterOption>;

  @State() open: boolean;

  // We need to do this to reliably disconnect the click-away listener
  clickListenerSymbol = new AbortController();
  componentDidLoad() {
    this.popper = createPopper(this.dropdownButton, this.dropdownMenu, {placement: 'bottom-start', modifiers: [{name: 'offset', options: {offset: [-1, 14]}}]});

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

  handleSelectOption(e: any, option: IFilterOption) {
    e.stopPropagation();
    this.optionSelected.emit(option);
    this.value = option.value;
    this.hide();
  }

  // See https://popper.js.org/docs/v2/tutorial/
  // What we're doing here is clearing event listeners when they aren't needed, to increase performance in lists
  showDropdown() {
    this.open = true;
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
    const selectedOption = this.options?.find(option => option.value === this.value);

    // This is bassd on our current font and size and the widest character "W" being about 15px wide.
    // It's a crude way to reserve a balanced amount of space so the top-level control doesn't jump
    // around when the selected option changes.
    const longestOption = this.options?.reduce((prev, curr) => (prev.label.length > curr.label.length ? prev : curr));
    const minWidth = `${(longestOption?.label || 'FILLER').length * 15 + 110}px`;

    return (
      <Host class={{open: !!this.open}} style={{minWidth, display: 'inline-block'}}>
        <div class="control" onClick={e => this.toggleDropdown(e)} onBlur={e => this.handleHideDropdown(e)}>
          <div class="title" ref={el => (this.dropdownButton = el as HTMLElement)}>
            <span class="prefix">{this.label}:</span>
            {selectedOption ? selectedOption.label : this.placeholder}
          </div>

          <div style={{flex: '1'}} />

          <div class="separator" />

          <div class="arrow" innerHTML={DropdownArrow} aria-label="Open Menu" />
        </div>

        <div class="items" aria-hidden={!this.open} ref={el => (this.dropdownMenu = el as HTMLDivElement)} style={{minWidth}}>
          {this.options?.map(option =>
            option.label ? (
              <button onClick={e => this.handleSelectOption(e, option)} class={`option ${option.value === this.value ? 'selected' : ''}`} disabled={option.disabled}>
                {option.label}
              </button>
            ) : (
              <div class="separator" />
            ),
          )}
        </div>
      </Host>
    );
  }
}
