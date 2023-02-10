import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Create',
  component: 'verdocs-template-create',
  args: {},
  argTypes: {
    onCancel: {action: 'cancel'},
    onNext: {action: 'next'},
  },
} as Meta;

export const Create = ({onCancel, onNext}) => html`<verdocs-template-create @next=${onNext} @cancel=${onCancel} />`;
