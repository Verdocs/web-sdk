import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {loadStoryDefaults} from '../utils';

export default {
  title: 'Templates/Fields',
  component: 'verdocs-template-fields',
  args: loadStoryDefaults('templates-fields', {
    templateId: '',
  }),
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Fields = ({templateId}) =>
  html`<div style="height: 600px">
    <verdocs-template-fields .templateId=${templateId} />
  </div>`;
