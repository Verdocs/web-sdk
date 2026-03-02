import {html} from 'lit';
import {Meta} from '@storybook/web-components-vite';
import {loadStoryDefaults} from '../utils';

export default {
  title: 'Embeds/Send',
  component: 'verdocs-send',
  args: loadStoryDefaults('embeds-send', {
    templateId: '',
    showCancel: true,
  }),
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Send = ({templateId, showCancel, onSend}) => html`<verdocs-send .templateId=${templateId} .showCancel=${showCancel} @send=${onSend} />`;
