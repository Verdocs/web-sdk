import {Component, Prop, h, Event, EventEmitter} from '@stencil/core';

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
   * The label for the button.
   */
  @Prop() label: string = '';

  /**
   * If desired, a prefix icon for the button
   */
  @Prop() startIcon: any = null;

  /**
   * If desired, a suffix icon for the button
   */
  @Prop() endIcon: any = null;

  /**
   * The size (height) of the button.
   */
  @Prop() size: 'small' | 'normal' | 'medium' | 'large' = 'normal';

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

  handleClick(e: any) {
    e.preventDefault();
    this.press.emit();
  }

  render() {
    console.log('Rendering button', this.startIcon);
    return (
      <button disabled={this.disabled} type={this.type} onClick={e => this.handleClick(e)} class={`${this.variant} ${this.size} ${this.type}`}>
        {this.startIcon ? <span class="icon start" innerHTML={this.startIcon} /> : null}
        <span class="label">{this.label}</span>
        {this.endIcon ? <span class="icon end" innerHTML={this.endIcon} /> : null}
      </button>
    );
  }
}
