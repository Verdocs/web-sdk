import {Component, h, Host} from '@stencil/core';

/**
 * Animated loader placeholder. There are currently no configuration options for this control.
 *
 * ```ts
 * <verdocs-loader />
 * ```
 */
@Component({
  tag: 'verdocs-loader',
  styleUrl: 'verdocs-loader.scss',
  shadow: false,
})
export class VerdocsLoader {
  render() {
    return <Host />;
  }
}
