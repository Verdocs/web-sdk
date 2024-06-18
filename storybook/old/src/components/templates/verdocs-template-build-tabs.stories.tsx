import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Build Tabs',
  component: 'verdocs-template-build-tabs',
  args: {
    templateId: '',
    step: 'preview',
  },
  argTypes: {
    onStepChanged: {action: 'stepChanged'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const BuildTabs = ({templateId, step, onStepChanged}) => html`<verdocs-template-build-tabs .step=${step} .templateId=${templateId} @stepChanged=${onStepChanged} />`;
