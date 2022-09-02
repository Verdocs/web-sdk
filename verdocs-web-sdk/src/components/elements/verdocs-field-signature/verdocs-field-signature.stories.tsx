import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Signature',
  component: 'verdocs-field-signature',
  args: {
    name: 'Paige Turner',
    field: {
      settings: {
        x: 0,
        y: 0,
      },
    },
  },
  argTypes: {},
} as Meta;

export const Signature = ({name, field}) => html`<verdocs-field-signature .name=${name} .field=${field} />`;
