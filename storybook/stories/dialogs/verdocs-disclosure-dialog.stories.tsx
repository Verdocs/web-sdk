import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {DEFAULT_DISCLOSURES} from '@verdocs/js-sdk';

export default {
  title: 'Dialogs/Disclosure Dialog',
  component: 'verdocs-disclosure-dialog',
  args: {
    disclosures: DEFAULT_DISCLOSURES,
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
