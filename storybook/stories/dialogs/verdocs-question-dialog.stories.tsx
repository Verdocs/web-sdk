import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {loadStoryDefaults} from '../utils';

export default {
  title: 'Dialogs/Question Dialog',
  component: 'verdocs-question-dialog',
  args: loadStoryDefaults('dialogs-question-dialog', {
    question: '',
  }),
} as Meta;

export const QuestionDialog = ({question, onNext, onExit}) =>
  html`<div style="width: 500px; height: 300px;">
    <verdocs-question-dialog .question=${question} @exit=${onExit} @next=${onNext} />
  </div>`;
