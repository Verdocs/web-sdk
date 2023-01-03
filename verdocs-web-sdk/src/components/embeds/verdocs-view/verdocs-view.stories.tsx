import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/View',
  component: 'verdocs-view',
  args: {
    envelopeId: '516d0ddf-0cf6-4e37-99f6-2046bcd795d0',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const View = ({envelopeId}) => html`<verdocs-view .envelopeId=${envelopeId} />`;
