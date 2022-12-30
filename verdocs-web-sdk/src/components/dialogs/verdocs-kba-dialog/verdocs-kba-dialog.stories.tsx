import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/KBA Dialog',
  component: 'verdocs-kba-dialog',
  args: {
    mode: 'choice',
    helptitle: 'One Time Code',
    helptext: 'Please check your text messages for a security code, and enter the code below.',
    label: 'PIN',
    placeholder: 'Enter your PIN...',
    step: 1,
    steps: 3,
    choices: ['553 Arbor Dr', '18 Lacey Ln', '23A Ball Ct', '2375 Cavallo Blvd', '23-1 RR-7', '151 Boulder Rd'],
  },
  argTypes: {
    onNext: {
      action: 'next',
      table: {disable: true},
    },
    onCancel: {
      action: 'cancel',
      table: {disable: true},
    },
  },
} as Meta;

export const KBADialog = ({helptitle, helptext, label, placeholder, mode, step, steps, choices, onNext, onCancel}) =>
  html`<verdocs-kba-dialog
    .mode=${mode}
    .helptitle=${helptitle}
    .helptext=${helptext}
    .label=${label}
    .placeholder=${placeholder}
    .step=${step}
    .steps=${steps}
    .choices=${choices}
    @next=${onNext}
    @cancel=${onCancel}
  />`;
