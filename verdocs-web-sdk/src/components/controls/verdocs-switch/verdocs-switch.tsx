import {Component, Prop, h, EventEmitter, Event} from '@stencil/core';

/**
 * Displays a toggle switch
 *
 * ```ts
 * <verdocs-switch checked={sendReminders} onCheckedChange={setSendReminders} />
 * ```
 */
@Component({
  tag: 'verdocs-switch',
  styleUrl: 'verdocs-switch.scss',
})
export class VerdocsSwitch {
  @Prop({mutable: true}) checked: boolean = false;

  /**
   * Select purple or green treatments.
   */
  @Prop() theme: 'primary' | 'secondary' = 'primary';

  /**
   * Should the field be disabled?
   */
  @Prop() disabled: boolean = false;

  @Event({composed: true}) checkedChange: EventEmitter<boolean>;

  render() {
    return (
      <button
        value="on"
        type="button"
        role="switch"
        class={`switch ${this.theme} ${this.disabled ? 'disabled' : ''}`}
        data-state={this.checked ? 'checked' : 'unchecked'}
        aria-checked={this.checked ? 'checked' : 'unchecked'}
        onClick={() => {
          if (!this.disabled) {
            this.checked = !this.checked;
            this.checkedChange?.emit(this.checked);
          }
        }}
      >
        <span data-state={this.checked ? 'checked' : 'unchecked'} class="slider"></span>
      </button>
    );
  }
}
