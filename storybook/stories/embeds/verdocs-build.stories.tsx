import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Build',
  component: 'verdocs-build',
  args: {
    templateId: '',
    step: 'preview',
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Build = ({templateId, step, ...params}) =>
  html`<div style="width: 100%; height: 500px; padding: 20px; box-sizing: border-box;">
    <verdocs-build .step=${step} .templateId=${templateId} />
  </div>`;
