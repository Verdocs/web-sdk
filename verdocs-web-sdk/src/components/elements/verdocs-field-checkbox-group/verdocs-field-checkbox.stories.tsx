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
    option: 0,
    disabled: false,
  },
  argTypes: {},
} as Meta;

export const Checkbox = ({field, option, disabled}) => html`<verdocs-field-checkbox .field=${field} .option=${option} .disabled=${disabled} />`;
