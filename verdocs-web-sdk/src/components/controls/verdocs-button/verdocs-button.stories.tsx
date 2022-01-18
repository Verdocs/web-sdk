import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Button',
  component: 'verdocs-button',
  args: {
    label: 'Click Me',
    type: 'button',
    disabled: false,
  },
  argTypes: {
    variant: {defaultValue: 'standard'},
    press: {
      action: 'press',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Button = ({label, variant, disabled, press}) => html`<verdocs-button .label=${label} .variant=${variant} .disabled=${disabled} @press=${press} />`;
