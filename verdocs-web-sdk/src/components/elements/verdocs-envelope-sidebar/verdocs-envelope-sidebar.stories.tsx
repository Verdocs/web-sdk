import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Envelopes/Envelope Sidebar',
  component: 'verdocs-envelope-sidebar',
  args: {
    envelopeId: 'f0fa431d-e3eb-4fd7-b30e-6d95e2e87b38',
  },
  argTypes: {
    envelopeId: {name: 'envelopeId'},
    toggle: {action: 'toggle'},
  },
} as Meta;

export const EnvelopeSidebar = ({envelopeId, toggle}) => html`<verdocs-envelope-sidebar .envelopeId=${envelopeId} @toggle=${toggle} />`;
