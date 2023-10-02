import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Build',
  component: 'verdocs-build',
  args: {
    templateId: '90c2e63d-6b61-4dd2-a2e2-e137778f5ab5',
    step: 'preview',
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Build = ({templateId, step}) => html`<verdocs-build .step=${step} .templateId=${templateId} />`;
