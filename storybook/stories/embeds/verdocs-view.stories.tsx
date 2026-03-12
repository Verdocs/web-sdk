import {html} from 'lit';
import {Meta} from '@storybook/web-components-vite';
import {loadStoryDefaults} from '../utils';

export default {
  title: 'Embeds/View',
  component: 'verdocs-view',
  args: loadStoryDefaults('embeds-view', {
    envelopeId: '',
  }),

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
    ? html`<img src="https://public-assets.verdocs.com/billofsale-signed.png" alt="Signed document sample" style="display: flex; row-gap: 15px; padding: 15px;" />`
    : html`<verdocs-view .envelopeId=${envelopeId} />`;
