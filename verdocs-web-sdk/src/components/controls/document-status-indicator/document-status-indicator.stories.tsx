import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Elements/Document Status Indicator',
  component: 'document-status-indicator',
  args: {
    status: 'finished'
  },
  argTypes: {
    status: {type: 'string', control: 'radio', options: [
      'finished', 'complete', 'pending', 'in-progress',  'declined', 'cancelled'
    ]},
    theme: {type: 'string', control: 'radio', options:['light', 'dark'], defaultValue: 'light'}
  },
} as Meta;

export const Default = ({status, theme}) => html`<document-status-indicator .status="${status}" .theme="${theme}"></document-status-indicator>`;
