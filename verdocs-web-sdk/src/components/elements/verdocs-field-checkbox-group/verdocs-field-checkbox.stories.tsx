import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Checkbox',
  component: 'verdocs-field-checkbox',
  args: {
    field: {
      settings: {
        x: 0,
        y: 0,
      },
    },
  },
  argTypes: {},
} as Meta;

export const Checkbox = ({field}) => html`<verdocs-field-checkbox .field=${field} />`;
