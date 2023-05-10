import {Component, Prop, h} from '@stencil/core';

/**
 * Display a simple button.
 *
 * Three variants are supported. `standard` and `outline` buttons look like traditional form buttons and are ideal candidates for 'Ok' and
 * 'Cancel' options in most cases. `text` buttons are intended to be used inline in content blocks or for more subtle button options.
 * (Auth uses text buttons for the Forgot Password and Sign Up options.)
 *
 * Four sizes are also supported. Most use cases will call for the `normal` size, but a `small` size is ideal for more subtle controls, such
 * as pagination or other secondary functions. `medium` buttons are slightly larger to provide balance in forms where other items are also
 * bigger, and `large` buttons are for cases where the page has mostly white-space and the buttons need to fill more space.
 *
 * Icons may be placed either before ("start") or after ("end") the button label. Icons should be SVG objects passed as strings and will
 * be rendered as HTML inside the button label area. It is important that the root <SVG> tag contains a default `fill="#ffffff"` setting
 * for the base color, and that child elements below it do not. This allows the button color to carry into the icon properly.
 *
 * ```html
 * <verdocs-button label="OK" onClick={() => (console.log('OK clicked'))} />
 * ```
 */
@Component({
  tag: 'verdocs-button',
  styleUrl: 'verdocs-button.scss',
})
export class VerdocsButton {
  /**
   * The label for the button.
   */
  @Prop() label!: string;

  /**
   * If desired, a prefix icon for the button.
   */
  @Prop() startIcon: string | null = null;

  /**
   * If desired, a suffix icon for the button.
   */
  @Prop() endIcon: string | null = null;

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

  render() {
    return (
      <button disabled={this.disabled} type={this.type} class={`${this.variant} ${this.size} ${this.type}`}>
        {this.startIcon ? <span class="icon start" innerHTML={this.startIcon} /> : null}
        <span class="button-label">{this.label}</span>
        {this.endIcon ? <span class="icon end" innerHTML={this.endIcon} /> : null}
      </button>
    );
  }
}
