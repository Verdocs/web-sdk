import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Buttons/Text',
  component: 'verdocs-text-button',
  args: {
    label: 'Click Me',
  },
  argTypes: {
    tclick: {
      action: 'tclick',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Default = ({label, type, disabled, tclick}) => html`<verdocs-text-button .label=${label} .type=${type} .disabled=${disabled} @tclick=${tclick} />`;
