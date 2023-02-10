import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Send',
  component: 'verdocs-send',
  args: {
    templateId: 'd2338742-f3a1-465b-8592-806587413cc1',
  },
  argTypes: {
    templateId: {control: {type: 'string'}},
    onSend: {action: 'send'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Send = ({templateId, onSend}) => html`<verdocs-send .templateId=${templateId} @send=${onSend} />`;
