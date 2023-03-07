import {Component, Prop, Host, h} from '@stencil/core';

/**
 * Display a text input field. This is just a standard HTML input field with minimal markup to fit the
 * visual styles of the other components. Note that events "bubble" from the input field to the container,
 * so you can subscribe to the same DOM events (input, blur, etc) that a normal input would emmit.
 */
@Component({
  tag: 'verdocs-text-input',
  styleUrl: 'verdocs-text-input.scss',
})
export class VerdocsTextInput {
  /**
   * The initial value for the input field.
   */
  @Prop() value: string = '';

  /**
   * The label for the field.
   */
  @Prop() label: string = '';

  /**
   * The placeholder for the field.
   */
  @Prop() placeholder: string = '';

  /**
   * If desired, the autocomplete attribute to set.
   */
  @Prop() autocomplete: string = '';

  /**
   * If supplied, a help icon will be displayed to provide the user more information.
   */
  @Prop() helpText: string = '';

  /**
   * The type of field to render. Only text-type fields are allowed here for the current styling. Additional types
   * (e.g. a date picker) will be supported by other controls in the future.
   */
  @Prop() type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' = 'text';

  /**
   * Should the field be disabled?
   */
  @Prop() disabled: boolean = false;

  render() {
    return (
      <Host class="input-field">
        <label>
          {this.label && <div class="input-label">{this.label + ':'}</div>}
          <input
            type={this.type}
            value={this.value}
            class="input-element"
            data-lpignore="true"
            disabled={this.disabled}
            placeholder={this.placeholder}
            autoComplete={this.autocomplete}
          />

          {this.helpText && <verdocs-help-icon text={this.helpText} />}
        </label>
      </Host>
    );
  }
}
