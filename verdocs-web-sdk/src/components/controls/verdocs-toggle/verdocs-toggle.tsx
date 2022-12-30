import {Component, Prop, h, State} from '@stencil/core';

export interface IButtons {
  id: string;
  icon: string;
}

export interface IToggleIconButtons {
  label: string;
  defaultSelection: number;
  buttons: IButtons[];
}

/**
 * Displays a label and a set of buttons, also allowing a default selection of a button
 */
@Component({
  tag: 'verdocs-toggle',
  styleUrl: 'verdocs-toggle.scss',
})
export class VerdocsToggle {
  /**
   * The tags to display
   */
  @Prop() options: IToggleIconButtons;

  /**
   * The "theme" to be used
   */
  @Prop() theme: 'light' | 'dark';

  @State() selectedOption: number = 0;

  componentWillLoad() {
    this.selectedOption = this.options?.defaultSelection || 0;
  }

  render() {
    return (
      <div class="container">
        <span class="label">{`${this.options.label}:`}</span>
        <div class="buttons">
          {this.options.buttons.map((button: IButtons, index: number) => (
            <button
              id={button.id}
              key={button.id}
              innerHTML={button.icon}
              class={index === this.selectedOption ? 'selected' : ''}
              onClick={() => {
                console.log('clicked', index);
                this.selectedOption = index;
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}
