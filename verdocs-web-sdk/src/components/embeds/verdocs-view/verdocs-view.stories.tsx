import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/View',
  component: 'verdocs-view',
  args: {
    envelopeId: '92f3dd1e-9ff2-44c3-8c96-32a5b650ed6d',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const View = ({envelopeId}) => html`<verdocs-view .envelopeId=${envelopeId} />`;
