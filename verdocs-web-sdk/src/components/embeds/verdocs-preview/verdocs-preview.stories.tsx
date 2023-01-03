import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Preview',
  component: 'verdocs-preview',
  args: {
    templateId: 'd2338742-f3a1-465b-8592-806587413cc1',
  },
  argTypes: {
    templateId: {control: {type: 'string'}},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Preview = ({templateId}) => html`<verdocs-preview .templateId=${templateId} />`;