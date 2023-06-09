import {Component, h, Host, Prop} from '@stencil/core';

const LIGHT_STYLE = {border: '3px solid rgba(255, 255, 255, 0.3)', borderTopColor: '#fff'};
const DARK_STYLE = {border: '3px solid rgba(0, 0, 0, 0.3)', borderTopColor: '#333'};

/**
 * Display a small loading spinner.
 */
@Component({
  tag: 'verdocs-spinner',
  styleUrl: 'verdocs-spinner.scss',
})
export class VerdocsQuickFilter {
  @Prop()
  size: number = 32;

  @Prop()
  mode: 'light' | 'dark' = 'light';

  render() {
    return (
      <Host
        style={{
          width: `${this.size}px`, //
          height: `${this.size}px`,
          flex: `0 0 ${this.size}px`,
          ...(this.mode === 'light' ? LIGHT_STYLE : DARK_STYLE),
        }}
      />
    );
  }
}
