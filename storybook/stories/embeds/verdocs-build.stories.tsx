import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {loadStoryDefaults} from '../utils';

export default {
  title: 'Embeds/Build',
  component: 'verdocs-build',
  args: loadStoryDefaults('embeds-build', {
    templateId: '',
    step: 'preview',
  }),
  step: {
    control: 'select',
    options: ['attachments', 'roles', 'settings', 'fields', 'preview'],
    description: 'The step to display.',
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Build = ({templateId, step, ...params}) =>
  html`<div style="width: 100%; height: 500px; padding: 20px; box-sizing: border-box;">
    <verdocs-build .step=${step} .templateId=${templateId} />
  </div>`;
