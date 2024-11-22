import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Send',
  component: 'verdocs-send',
  args: {
    templateId: '1c355c0e-0235-4d37-9df0-083ea3db5653',
  },
  argTypes: {
    onSend: {action: 'send'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Send = ({templateId, onSend}) => html`<verdocs-send .templateId=${templateId} @send=${onSend} />`;
