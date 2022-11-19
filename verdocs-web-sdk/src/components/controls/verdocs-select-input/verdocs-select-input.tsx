import {Component, Prop, State, Host, h} from '@stencil/core';

/**
 * Display a text input field. This is just a standard HTML input field with minimal markup to fit the
 * visual styles of the other components. Note that events "bubble" from the input field to the container,
 * so you can subscribe to the same DOM events (input, blur, etc) that a normal input would emmit.
 */
@Component({
  tag: 'verdocs-select-input',
  styleUrl: 'verdocs-select-input.scss',
})
export class VerdocsSelectInput {
  /**
   * The initial value for the input field.
   */
  @Prop() value: string = '';

  /**
   * The label for the field.
   */
  @Prop() label: string = '';

  /**
   * The options to list.
   */
  @Prop() options: {label: string; value: string}[];

  /**
   * Should the field be disabled?
   */
  @Prop() disabled: boolean = false;

  @State() _value: string = '';

  componentWillLoad() {
    this._value = this.value;
  }

  componentDidLoad() {}

  handleInput(e: any) {
    this._value = e.target.value;
  }

  render() {
    return (
      <Host class="input-field">
        <label>
          {this.label ? <div class="input-label">{this.label + ':'}</div> : <div />}
          <select class="input-element" disabled={this.disabled} onInput={e => this.handleInput(e)}>
            {this.options.map(option => (
              <option value={option.value} selected={option.value === this.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </Host>
    );
  }
}
