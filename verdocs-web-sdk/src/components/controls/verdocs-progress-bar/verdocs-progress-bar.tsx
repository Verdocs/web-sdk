import {Component, Prop, h, Host} from '@stencil/core';

/**
 * Displays a summary of a template
 */
@Component({
  tag: 'verdocs-progress-bar',
  styleUrl: 'verdocs-progress-bar.scss',
  shadow: false,
})
export class VerdocsProgressBar {
  /**
   * Optional label to display above the bar
   */
  @Prop() label: string = '';

  /**
   * If true, the progress percentage will be displayed above the bar.
   */
  @Prop() showPercent: boolean = false;

  /**
   * The current progress value (0-100)
   */
  @Prop() percent: number = 0;

  render() {
    const widthPercent = Math.ceil((100 * Math.min(this.percent, 100)) / 100);

    return (
      <Host>
        <div class="labels">
          {this.label && <div class="label">{this.label}</div>}
          {this.showPercent && <div class="label">{this.percent}%</div>}
        </div>

        <div class="bar">
          <div class="slider" style={{width: `${widthPercent}%`}}></div>
        </div>
      </Host>
    );
  }
}
