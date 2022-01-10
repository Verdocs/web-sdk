import {Component, Prop, h, Event, EventEmitter} from '@stencil/core';

/**
 * Display a button.
 */
@Component({
  tag: 'verdocs-button',
  styleUrl: 'verdocs-button.scss',
})
export class VerdocsButton {
  /**
   * The label for the  button.
   */
  @Prop() label: string = '';

  /**
   * The type of the button.
   */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Whether the button should be disabled.
   */
  @Prop() disabled: boolean = false;

  /**
   * Event fired when the button is pressed.
   */
  @Event({composed: true}) press: EventEmitter<string>;

  componentWillLoad() {}

  componentDidLoad() {}

  handleClick(e: any) {
    e.preventDefault();
    this.press.emit(e);
  }

  render() {
    return (
      <button class="button" disabled={this.disabled} type={this.type} onClick={e => this.handleClick(e)}>
        {this.label}
      </button>
    );
  }
}
