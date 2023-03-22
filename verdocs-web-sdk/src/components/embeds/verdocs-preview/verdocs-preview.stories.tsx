import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Preview',
  component: 'verdocs-preview',
  args: {
    templateId: '',
  },
  argTypes: {
    templateId: {control: {type: 'string'}},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Preview = ({templateId}) =>
  !templateId
    ? html`<img src="https://verdocs-public-assets.s3.amazonaws.com/billofsale-signed.png" alt="Signed document sample" style="display: flex; row-gap: 15px; padding: 15px;" />`
    : html`<verdocs-preview .templateId=${templateId} />`;
