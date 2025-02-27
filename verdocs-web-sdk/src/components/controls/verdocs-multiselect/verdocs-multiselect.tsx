import {randomString} from '@verdocs/js-sdk';
import {Component, Prop, Host, h, State, EventEmitter, Event} from '@stencil/core';

export interface IMultiSelectOption {
  label: string;
  value: string;
}

const DownIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>`;

/**
 * Display a dropdown that allows multiple options to be selected. Note that events "bubble" from the
 * input field to the container, so you can subscribe to the same DOM events (input, blur, etc) that a
 * normal input would emit.
 *
 * ```ts
 * <verdocs-multiselect label="Methods:" value={[]} options={[...options]} onInput={() => {}} />
 * ```
 */
@Component({
  tag: 'verdocs-multiselect',
  styleUrl: 'verdocs-multiselect.scss',
})
export class VerdocsMultiselect {
  /**
   * The label for the field.
   */
  @Prop() label: string = '';

  /**
   * The placeholder for the input element when no options are selected.
   */
  @Prop() placeholder: string = 'Select...';

  /**
   * The options to list.
   */
  @Prop() options: IMultiSelectOption[];

  /**
   * The currently selected options.
   */
  @Prop() selectedOptions: string[] = [];

  @Event({composed: true}) selectionChanged: EventEmitter<{selectedOptions: string[]}>;

  @State() showPicker = false;

  handleToggleOption(e: any, option: IMultiSelectOption) {
    if (e.target.checked) {
      this.selectedOptions = [...this.selectedOptions, option.value];
    } else {
      this.selectedOptions = this.selectedOptions.filter(selected => selected !== option.value);
    }

    this.selectionChanged?.emit({selectedOptions: this.selectedOptions});
  }

  render() {
    const elId = `verdocs-dropdown-${randomString(8)}`;

    return (
      <Host class={this.showPicker ? 'open' : 'closed'}>
        <label>
          {this.label ? <div class="input-label">{this.label + ':'}</div> : <div />}
          <div class="input-wrapper">
            <button id={elId} class="trigger" value="" onClick={() => (this.showPicker = true)}>
              {this.selectedOptions.length === 0 ? (
                <span class="placeholder">{this.placeholder}</span>
              ) : (
                this.selectedOptions.map(option => <span class="selected-option">{this.options.find(opt => opt.value === option)?.label || 'Unknown'}</span>)
              )}
            </button>

            <div class="icon" innerHTML={DownIcon} />

            {this.showPicker && (
              <verdocs-portal anchor={elId} voffset={2} onClickAway={() => (this.showPicker = false)} id="verdocs-multiselect-menu-items">
                {this.options.map((option, i) => (
                  <div class="option" onClick={() => (this.showPicker = false)}>
                    <verdocs-checkbox
                      size="small"
                      id={`verdocs-multi-select-opt-${i}`}
                      value={option.value}
                      checked={this.selectedOptions.includes(option.value)}
                      onInput={(e: any) => this.handleToggleOption(e, option)}
                    />
                    {/*<input*/}
                    {/*  id={`verdocs-multi-select-option-${i}`}*/}
                    {/*  type="checkbox"*/}
                    {/*  value={option.value}*/}
                    {/*  checked={this.selectedOptions.includes(option.value)}*/}
                    {/*  onInput={(e: any) => this.handleToggleOption(e, option)}*/}
                    {/*/>*/}
                    <label htmlFor={`verdocs-multi-select-option-${i}`}>{option.label}</label>
                  </div>
                ))}
              </verdocs-portal>
            )}
          </div>
        </label>
      </Host>
    );
  }
}
