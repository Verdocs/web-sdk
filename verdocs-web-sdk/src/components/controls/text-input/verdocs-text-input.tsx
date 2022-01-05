import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';

/**
 * Display a text input field. This is just a standard HTML input field with minimal markup to fit the
 * visual styles of the other components. Bear in mind Stencil does not currently support emitting events
 * with the same names as native DOM events, so rather than `input` or `blur` we have `tinput`, `tblur`,
 * etc. We used a temporary prefix here to mark this as a temporary API, because we hope this will change
 * in a future Stencil release. See https://github.com/ionic-team/stencil/issues/2822.
 */
@Component({
  tag: 'verdocs-text-input',
  styleUrl: 'verdocs-text-input.scss',
})
export class VerdocsTextInput {
  /**
   * The value for the input field.
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
   * The type of field to render. Only text-type fields are allowed here for the current styling. Additional types
   * (e.g. a date picker) will be supported by other controls in the future.
   */
  @Prop() type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' = 'text';

  @State() _value: string = '';

  /**
   * Event fired when the input value changes.
   */
  @Event({composed: true}) tinput: EventEmitter<string>;

  /**
   * Event fired when the field receives focus.
   */
  @Event({composed: true}) tfocus: EventEmitter;

  /**
   * Event fired when the field loses focus.
   */
  @Event({composed: true}) tblur: EventEmitter;

  componentWillLoad() {
    this._value = this.value;
  }

  componentDidLoad() {}

  handleInput(event) {
    this._value = event.target.value;
    this.tinput.emit(this._value);
  }

  handleFocus(event) {
    this.tfocus.emit(event);
  }

  handleBlur(event) {
    this.tblur.emit(event);
  }

  render() {
    return (
      <div class="input-field">
        <label>
          {this.label ? <div class="input-label">{this.label + ':'}</div> : <div />}
          <input
            type={this.type}
            placeholder={this.placeholder}
            autoComplete={this.autocomplete}
            value={this._value}
            class="input-element"
            onInput={event => this.handleInput(event)}
            onFocus={event => this.handleFocus(event)}
            onBlur={event => this.handleBlur(event)}
          />
        </label>
      </div>
    );
  }
}
