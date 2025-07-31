import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Embeds/Preview',
  component: 'verdocs-preview',
  args: {
    templateId: '',
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Preview = ({templateId}) =>
  !templateId
    ? html`<img src="https://public-assets.verdocs.com/billofsale-signed.png" alt="Signed document sample" style="display: flex; row-gap: 15px; padding: 15px;" />`
    : html`<verdocs-preview .templateId=${templateId} />`;
