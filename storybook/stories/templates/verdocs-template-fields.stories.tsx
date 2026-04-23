import {html} from 'lit';
import {Meta} from '@storybook/web-components-vite';
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
    <verdocs-template-fields .templateId=${templateId} @templateUpdated=${e => console.log('Template updated', e)} />
  </div>`;
