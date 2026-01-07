import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Signing Progress',
  component: 'verdocs-signing-progress',
  args: {
    current: 0,
    total: 3,
    mode: 'start',
    fieldLabel: 'Signature',
    fieldCompleted: false,
  },
  argTypes: {
    current: {control: 'number'},
    total: {control: 'number'},
    mode: {control: 'radio', options: ['start', 'signing', 'completed']},
    onStart: {
      action: 'start',
      table: {disable: true},
    },
    onNext: {
      action: 'next',
      table: {disable: true},
    },
    onPrevious: {
      action: 'previous',
      table: {disable: true},
    },
    onSubmit: {
      action: 'submitEvent',
      table: {disable: true},
    },
  },
} as Meta;

export const SigningProgress = ({current, total, mode, fieldLabel, fieldCompleted, onExit}) =>
  html`<div style="width: 500px; height: 600px;">
    <verdocs-signing-progress .current=${current} .total=${total} .mode=${mode} .fieldLabel=${fieldLabel} .fieldCompleted=${fieldCompleted} @exit=${onExit} />
  </div>`;
