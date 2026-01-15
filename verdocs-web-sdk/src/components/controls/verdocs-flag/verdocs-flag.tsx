import {Component, Prop, h, Event, EventEmitter} from '@stencil/core';

@Component({
  tag: 'verdocs-flag',
  styleUrl: 'verdocs-flag.scss',
  shadow: false,
})
export class VerdocsFlag {
  /**
   * The type of flag to display.
   */
  @Prop() variant: 'fill' | 'next' = 'fill';

  /**
   * The text label to display in the flag.
   */
  @Prop() label: string = 'FILL';

  /**
   * If true, shows "or SKIP" link.
   */
  @Prop() showSkip: boolean = false;

  /**
   * Emitted when the "SKIP" link is clicked.
   */
  @Event() skip: EventEmitter<void>;

  /**
   * Emitted when the main flag body is clicked (e.g. to focus field).
   */
  @Event() flagClick: EventEmitter<void>;

  render() {
    return (
      <div class={{'verdocs-flag': true, [`variant-${this.variant}`]: true}} onClick={() => this.flagClick.emit()}>
        <div class="label">
          {this.label}
          {this.showSkip && (
            <span>
              {' or '}
              <span
                class="link"
                onClick={e => {
                  e.stopPropagation();
                  this.skip.emit();
                }}
              >
                SKIP
              </span>
            </span>
          )}
        </div>
      </div>
    );
  }
}
