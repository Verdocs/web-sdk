// NOTE: This component does not have a story because it's not intended for external use.

import {Component, h, Host, Prop} from '@stencil/core';

/**
 * Render a simple error message.
 */
@Component({
  tag: 'verdocs-component-error',
  styleUrl: 'verdocs-component-error.scss',
  shadow: false,
})
export class VerdocsComponentError {
  /**
   * The message to display.
   */
  @Prop() message: string = '';

  render() {
    return (
      <Host>
        <div class="inner">{this.message}</div>
      </Host>
    );
  }
}
