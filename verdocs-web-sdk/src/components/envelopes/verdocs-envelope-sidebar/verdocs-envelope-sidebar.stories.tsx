import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Envelopes/Envelope Sidebar',
  component: 'verdocs-envelope-sidebar',
  args: {
    envelopeId: '',
  },
  argTypes: {
    envelopeId: {name: 'envelopeId'},
    toggle: {action: 'toggle'},
  },
} as Meta;

export const EnvelopeSidebar = ({envelopeId, toggle}) => html`<verdocs-envelope-sidebar .envelopeId=${envelopeId} @toggle=${toggle} />`;
