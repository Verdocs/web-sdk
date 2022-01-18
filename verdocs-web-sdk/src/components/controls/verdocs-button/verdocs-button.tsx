import {Component, Prop, h, Host, Event, EventEmitter} from '@stencil/core';

/**
 * Display a simple button. Three variants are supported. Standard and Outline buttons look like traditional form buttons and are
 * ideal candidates for 'Ok' and 'Cancel' options in most cases. Text buttons are intended to be used inline in content blocks or
 * for more subtle button options. (Auth uses text buttons for the Forgot Password and Sign Up options.)
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
   * The display variant of the button.
   */
  @Prop() variant: 'standard' | 'text' | 'outline' = 'standard';

  /**
   * Whether the button should be disabled.
   */
  @Prop() disabled: boolean = false;

  /**
   * Event fired when the button is pressed.
   */
  @Event({composed: true}) press: EventEmitter;

  componentWillLoad() {}

  componentDidLoad() {}

  handleClick(e: any) {
    e.preventDefault();
    this.press.emit();
  }

  render() {
    return (
      <Host class={`${this.variant}`}>
        <button disabled={this.disabled} type={this.type} onClick={e => this.handleClick(e)}>
          {this.label}
        </button>
      </Host>
    );
  }
}
