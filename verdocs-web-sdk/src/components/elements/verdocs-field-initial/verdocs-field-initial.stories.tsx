import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Initial',
  component: 'verdocs-field-initial',
  args: {
    initials: 'PT',
    field: {
      settings: {
        x: 0,
        y: 0,
      },
    },
  },
  argTypes: {},
} as Meta;

export const Initial = ({initials, field}) => html`<verdocs-field-initial .field=${field} .initials=${initials} />`;
