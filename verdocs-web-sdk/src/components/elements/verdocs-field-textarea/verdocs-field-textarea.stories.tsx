import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Textarea',
  component: 'verdocs-field-textarea',
  args: {
    field: {
      settings: {
        placeholder: 'Email address...',
        x: 0,
        y: 0,
      },
    },
  },
  argTypes: {},
} as Meta;

export const Textarea = ({field}) => html`<verdocs-field-textarea .field=${field} />`;
