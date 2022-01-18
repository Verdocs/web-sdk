import {Component, Event, EventEmitter, h, Host, Prop} from '@stencil/core';

/**
 * Displays a signature field. Various field types are supported, including traditional Signature and Initials types as well as
 * input types like text and checkbox.
 */
@Component({
  tag: 'verdocs-field-dropdown',
  styleUrl: 'verdocs-field-dropdown.scss',
  shadow: false,
})
export class VerdocsFieldDropdown {
  /**
   * The optoins to choose from.
   */
  @Prop() options: any[] = [];

  /**
   * If true, the field will be marked required.
   */
  @Prop() required: boolean = false;

  /**
   * Sets the disabled attribute of the input element.
   */
  @Prop() disabled: boolean = false;

  /**
   * The currently selected value.
   */
  @Prop() value: string = '';

  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
   * It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
   * keypress.
   */
  @Event({composed: true}) fieldChange: EventEmitter<string>;

  handleChange(e: any) {
    this.fieldChange.emit(e.target.value);
  }

  render() {
    return (
      <Host class={{storybook: !!window?.['STORYBOOK_ENV'], required: this.required}}>
        <select disabled={this.disabled} onChange={e => this.handleChange(e)}>
          <option value="">Select...</option>
          {this.options.map(option => (
            <option value={option.id} selected={option.value === this.value}>
              {option.value}
            </option>
          ))}
        </select>
      </Host>
    );
  }
}
