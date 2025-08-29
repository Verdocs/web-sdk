import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Embeds/Send',
  component: 'verdocs-send',
  args: {
    templateId: '',
  },
  argTypes: {
    onSend: {action: 'send'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Send = ({templateId, onSend}) => html`<verdocs-send .templateId=${templateId} @send=${onSend} />`;
