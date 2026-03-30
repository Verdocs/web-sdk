import {html} from 'lit';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Dialogs/OTP Dialog',
  component: 'verdocs-otp-dialog',
  args: {
    method: 'email',
  },
  argTypes: {
    method: {
      control: 'select',
      options: ['email', 'sms'],
      description: 'How should the OTP be sent to the user?',
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
