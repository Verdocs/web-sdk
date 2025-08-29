import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Dialogs/Disclosure Dialog',
  component: 'verdocs-disclosure-dialog',
  args: {
    disclosures: `<div>
  <p>To proceed, please acknowledge and agree to the following Terms and Conditions for digitally signing this document.</p>
  <ul>
  <li>
    Agree to use electronic records and signatures, and confirm you have read the
    <a href="https://verdocs.com/en/electronic-record-signature-disclosure/" target="_blank">
      Electronic Record and Signatures Disclosure</a>.</li>
  <li>
    Agree to Verdocs'
    <a href="https://verdocs.com/en/eula" target="_blank">
      End User License Agreement</a>
    and confirm you have read Verdocs'
    <a href="https://verdocs.com/en/privacy-policy/" target="_blank">
      Privacy Policy</a>.
  </li>
</ul>
</div>`,
  },
  argTypes: {
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

export const DisclosureDialog = ({disclosures, onNext, onExit}) =>
  html`<div style="width: 500px; height: 600px;">
    <verdocs-disclosure-dialog .disclosures=${disclosures} @exit=${onExit} @next=${onNext} />
  </div>`;
