import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Send',
  component: 'verdocs-send',
  args: {
    templateId: '249a5122-2bf0-4e01-a519-d6d2d2362390',
  },
  argTypes: {
    onSend: {action: 'send'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Send = ({templateId, onSend}) => html`<verdocs-send .templateId=${templateId} @send=${onSend} />`;
