import {Component, Prop, h, Listen} from '@stencil/core';

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
 *
 * ```typescript
 *
 * ```
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

  @Listen('click', {
    target: 'document',
    capture: true,
    passive: false,
  })
  handleClick(event) {
    event.preventDefault();
    let container = event.target;
    if (container.matches('toggle-icon-buttons')) {
      container = event.target.shadowRoot;
      const element = container.activeElement;
      const siblings = Array.from(element.parentElement.children).filter(child => {
        return child !== element;
      });
      siblings.map((sibling: any) => {
        return sibling.classList.remove('selected');
      });
      if (!element.classList.contains('selected')) {
        element.classList.add('selected');
      }
    }
  }

  render() {
    return (
      <div class="container">
        <span class="label">{`${this.options.label}:`}</span>
        <div class="buttons">
          {this.options.buttons.map((button: IButtons, index: number) => (
            <button id={button.id} key={button.id} innerHTML={button.icon} class={index === this.options.defaultSelection ? 'selected' : ''} />
          ))}
        </div>
      </div>
    );
  }
}
