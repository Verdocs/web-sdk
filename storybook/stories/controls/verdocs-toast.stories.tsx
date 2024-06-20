import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {VerdocsToast} from '../../../verdocs-web-sdk/src/utils/Toast';

// This is a story-only control with no published component. Verdocs Toast is a simple function call that works
// directly against the raw DOM to eliminate the need for external dependencies and stylesheets.

export default {
  title: 'Controls/Toast',
  component: 'verdocs-toast',
  args: {
    text: 'Test message',
    duration: 3000,
    style: 'error',
  },
  argTypes: {
    style: {
      options: ['error', 'info', 'success', 'default'],
      control: {type: 'radio'},
    },
  },
} as Meta;

export const Toast = ({text, duration, style}) => html`<verdocs-button @click="${() => VerdocsToast(text, {duration, style})}" label="Show Toast" />`;
