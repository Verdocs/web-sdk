import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';

/**
 * Displays an initial field. If an initial already exists, it will be displayed and the field will be disabled. Otherwise, a placeholder
 * button will be shown. Clicking the button will show a dialog to adopt an initial.
 */
@Component({
  tag: 'verdocs-field-initial',
  styleUrl: 'verdocs-field-initial.scss',
  shadow: false,
})
export class VerdocsFieldInitial {
  /**
   * Whether the field is required.
   */
  @Prop() required: boolean = false;

  /**
   * The base64 signature value.
   */
  @Prop() value: string = '';

  /**
   * Event emitted when an initial block is adopted by the user. The event detail will contain the base64 string of the initial image.
   */
  @Event({composed: true}) adopt: EventEmitter<string>;

  /**
   * Event emitted when the user cancels the process.
   */
  @Event({composed: true}) cancel: EventEmitter;

  @State() showDialog = false;

  handleShow() {
    this.showDialog = true;
  }

  handleCancel() {
    this.cancel.emit();
    this.showDialog = false;
  }

  render() {
    return (
      <Host class={{storybook: !!window?.['STORYBOOK_ENV'], required: this.required}}>
        {this.value !== '' ? (
          <img src={this.value} alt="Initials" />
        ) : (
          <button class={{}} onClick={() => this.handleShow()}>
            Initial
          </button>
        )}

        <verdocs-initial-dialog open={this.showDialog} onAdopt={e => this.adopt.emit(e.detail)} onCancel={() => this.handleCancel()} />
      </Host>
    );
  }
}
