import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Buttons/Standard',
  component: 'verdocs-button',
  args: {
    label: 'Click Me',
  },
  argTypes: {
    press: {
      action: 'press',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Default = ({label, type, disabled, press}) => html`<verdocs-button .label=${label} .type=${type} .disabled=${disabled} @press=${press} />`;
