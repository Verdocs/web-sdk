import {Component, Prop, h} from '@stencil/core';

/**
 * A simple button
 *
 * ```jsx
 * <verdocs-button label="Click Me" />
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
