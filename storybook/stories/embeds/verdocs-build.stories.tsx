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

export const Build = ({templateId, step, ...params}) => {
  console.log('rendering', {templateId, step, params});
  return html`<verdocs-build .step=${step} .templateId=${templateId} />`;
};
