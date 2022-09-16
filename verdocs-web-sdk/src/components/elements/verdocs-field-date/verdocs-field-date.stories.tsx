import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Date',
  component: 'verdocs-field-date',
  args: {
    field: {
      settings: {
        x: 0,
        y: 0,
      },
    },
    disabled: false,
  },
  argTypes: {},
} as Meta;

export const Date = ({field, disabled}) => html`<verdocs-field-date .field="${field}.disabled" =${disabled} />`;
