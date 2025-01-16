import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Build',
  component: 'verdocs-build',
  args: {
    templateId: '1c355c0e-0235-4d37-9df0-083ea3db5653',
    step: 'preview',
  },
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
