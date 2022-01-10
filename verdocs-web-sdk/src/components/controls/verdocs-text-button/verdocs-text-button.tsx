import {Component, Prop, h, Event, EventEmitter} from '@stencil/core';

/**
 * Display a button.
 */
@Component({
  tag: 'verdocs-text-button',
  styleUrl: 'verdocs-text-button.scss',
})
export class VerdocsTextButton {
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
   * Event fired when the button is clicked.
   */
  @Event({composed: true}) press: EventEmitter<string>;

  render() {
    return (
      <button class="button" disabled={this.disabled} type={this.type} onClick={() => this.press.emit()}>
        {this.label}
      </button>
    );
  }
}
