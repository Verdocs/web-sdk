import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Initial',
  component: 'verdocs-field-initial',
  args: {
    required: false,
  },
  argTypes: {},
} as Meta;

export const Initial = ({required}) => html`<verdocs-field-initial .required=${required} />`;
