import {html} from 'lit';
import {Meta} from '@storybook/web-components-vite';

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
    onStarted: {
      action: 'started',
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
    onExit: {
      action: 'exit',
      table: {disable: true},
    },
  },
} as Meta;

export const SigningProgress = ({current, total, mode, fieldLabel, fieldCompleted, onExit}) =>
  html`<div style="width: 500px; height: 600px;">
    <verdocs-signing-progress .current=${current} .total=${total} .mode=${mode} .fieldLabel=${fieldLabel} .fieldCompleted=${fieldCompleted} @exit=${onExit} />
  </div>`;
