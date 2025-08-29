import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Dialogs/OTP Dialog',
  component: 'verdocs-otp-dialog',
  args: {
    method: 'email',
    helptitle: 'Previous Addresses',
    helptext: 'Please select the address below that you have most recently lived at.',
    label: 'Enter Your PIN:',
    placeholder: 'Please enter your PIN...',
    step: 1,
    steps: 3,
    choices: ['553 Arbor Dr', '18 Lacey Ln', '23A Ball Ct', '2375 Cavallo Blvd', '23-1 RR-7', '151 Boulder Rd'],
    recipient: {
      first_name: 'John',
      last_name: 'Smith',
      address: '18 Lacey Ln',
      zip: '12345',
      dob: null,
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['text', 'choice', 'identity'],
      description: 'Choose between text-input and multiple-choice responses.',
    },
    onNext: {
      action: 'next',
      table: {disable: true},
    },
    onExit: {
      action: 'exit',
      table: {disable: true},
    },
  },
} as Meta;

export const OTPDialog = ({helptitle, helptext, label, placeholder, method, recipient, step, steps, choices, onNext, onExit}) =>
  html`<div style="width: 500px; height: 500px;">
    <verdocs-otp-dialog
      .method=${method}
      .helptitle=${helptitle}
      .helptext=${helptext}
      .label=${label}
      .placeholder=${placeholder}
      .step=${step}
      .steps=${steps}
      .choices=${choices}
      .recipient=${recipient}
      @next=${onNext}
      @exit=${onExit}
    />
  </div>`;
