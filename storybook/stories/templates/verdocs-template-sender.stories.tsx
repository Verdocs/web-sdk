import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Sender',
  component: 'verdocs-template-sender',
  args: {
    templateId: '',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
} as Meta;

export const Sender = ({value, onClose}) => html`<verdocs-template-sender-dialog .value=${value} @close=${onClose} />`;
