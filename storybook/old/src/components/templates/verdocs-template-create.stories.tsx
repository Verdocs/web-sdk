import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Create',
  component: 'verdocs-template-create',
  args: {},
  argTypes: {
    onExit: {action: 'exit'},
    onNext: {action: 'next'},
  },
} as Meta;

export const Create = ({onExit, onNext}) => html`<verdocs-template-create @next=${onNext} @exit=${onExit} />`;
