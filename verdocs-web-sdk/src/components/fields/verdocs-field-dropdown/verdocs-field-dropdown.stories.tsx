import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Dropdown',
  component: 'verdocs-field-dropdown',
  args: {
    field: {
      settings: {
        x: 0,
        y: 0,
        options: [{id: 'id1', value: 'Option 1'}],
      },
    },
  },
  argTypes: {},
} as Meta;

export const Dropdown = ({field}) => html`<verdocs-field-dropdown .field=${field} />`;
