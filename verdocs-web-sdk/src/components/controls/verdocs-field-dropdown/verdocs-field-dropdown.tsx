import {Component, h, Host, Prop} from '@stencil/core';
import {IDocumentField} from '@verdocs/js-sdk/Documents/Documents';

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
   * The field to display.
   */
  @Prop() field: IDocumentField;

  /**
   * The optoins to choose from.
   */
  @Prop() options: any[];

  componentWillLoad() {}

  render() {
    return (
      <Host class={{storybook: !!window?.['STORYBOOK_ENV']}}>
        <select>
          {this.options.map(option => (
            <option value={option.id}>{option.value}</option>
          ))}
        </select>
      </Host>
    );
  }
}
