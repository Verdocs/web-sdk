import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/View',
  component: 'verdocs-view',
  args: {
    // f0fa431d-e3eb-4fd7-b30e-6d95e2e87b38
    envelopeId: '',
  },
  argTypes: {
    envelopeId: {
      name: 'envelopeId',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const View = ({envelopeId}) =>
  !envelopeId
    ? html`<img src="https://verdocs-public-assets.s3.amazonaws.com/billofsale-signed.png" alt="Signed document sample" style="display: flex; row-gap: 15px; padding: 15px;" />`
    : html`<verdocs-view .envelopeId=${envelopeId} />`;
