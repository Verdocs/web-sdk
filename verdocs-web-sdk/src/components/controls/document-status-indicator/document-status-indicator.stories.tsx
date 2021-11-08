import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Elements/Document Status Indicator',
  component: 'document-status-indicator',
  args: {
    status: 'finished',
  },
  argTypes: {
    status: {type: 'string', control: 'radio', options: ['complete', 'pending', 'in progress', 'declined', 'canceled']},
  },
} as Meta;

export const Default = ({status}) => html`<document-status-indicator .status="${status}"></document-status-indicator>`;
