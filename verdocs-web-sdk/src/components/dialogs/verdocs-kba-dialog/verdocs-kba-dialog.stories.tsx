import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/KBA Dialog',
  component: 'verdocs-kba-dialog',
  args: {
    open: true,
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
    closed: {
      action: 'closed',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const KBADialog = ({helptitle, helptext, label, placeholder, mode, step, steps, choices, open, closed}) =>
  html`<verdocs-kba-dialog
    .mode=${mode}
    .helptitle=${helptitle}
    .helptext=${helptext}
    .label=${label}
    .placeholder=${placeholder}
    .step=${step}
    .steps=${steps}
    .choices=${choices}
    .open=${open}
    @closed=${closed}
  />`;
