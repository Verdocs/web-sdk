import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Controls/Document Status',
  component: 'verdocs-docus-status',
  args: {},
  argTypes: {
    status: {
      defaultValue: 'complete',
      type: 'string',
      control: 'radio',
      options: ['complete', 'pending', 'in progress', 'declined', 'canceled'],
    },
  },
} as Meta;

export const DocumentStatus = ({status}) => html`<verdocs-document-status .status="${status}" />`;
