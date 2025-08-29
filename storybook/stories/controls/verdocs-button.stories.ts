import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';
import {action} from 'storybook/actions';
import {IconOptions, Icons} from '../icons';

export default {
  title: 'Controls/Button',
  component: 'verdocs-button',
  args: {
    label: 'Click Me',
    type: 'button',
    size: 'normal',
    variant: 'standard',
    disabled: false,
    startIcon: null,
    endIcon: null,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'The type of the button.',
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'medium', 'large'],
      description: 'The size of the button.',
    },
    variant: {control: 'select', options: ['standard', 'text', 'outline']},
    startIcon: {
      ...IconOptions,
      description: 'If set to an SVG, will be displayed to the left of the button label',
    },
    endIcon: {
      ...IconOptions,
      description: 'If set to an SVG, will be displayed to the right of the button label',
    },
  },
} as Meta;

export const Standard = () => html`<verdocs-button label="Click Me" @click=${action('click')} />`;

export const Outline = () => html`<verdocs-button label="Click Me" variant="outline" @click=${action('click')} />`;

export const Text = () => html`<verdocs-button label="Click Me" variant="text" @click=${action('click')} />`;

export const Disabled = () => html`<verdocs-button label="Click Me" disabled @click=${action('click')} />`;

export const Large = () => html`<verdocs-button label="Click Me" size="large" @click=${action('click')} />`;

export const Small = () => html`<verdocs-button label="Click Me" size="small" @click=${action('click')} />`;

export const StartIcon = () => html`<verdocs-button label="Click Me" .startIcon=${Icons.CalendarIcon} @click=${action('click')} />`;

export const EndIcon = () => html`<verdocs-button label="Click Me" .endIcon=${Icons.ArrowIcon} @click=${action('click')} />`;
