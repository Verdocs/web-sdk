import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
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
