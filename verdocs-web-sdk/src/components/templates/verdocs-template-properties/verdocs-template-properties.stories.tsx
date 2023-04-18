import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Properties',
  component: 'verdocs-template-properties',
  args: {
    templateId: '',
  },
  argTypes: {
    onExit: {action: 'exit'},
    onNext: {action: 'next'},
  },
} as Meta;

export const Properties = ({onExit, onNext, templateId}) => html`<verdocs-template-properties .templateId=${templateId} @exit=${onExit} @next=${onNext} />`;
