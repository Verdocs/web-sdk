import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/View',
  component: 'verdocs-view',
  args: {
    templateId: '056b837f-b183-4039-b50a-d68acbf81b67',
    envelopeId: '',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const View = ({templateId, envelopeId}) => html`<verdocs-view .templateId=${templateId} .envelopeId=${envelopeId} />`;
