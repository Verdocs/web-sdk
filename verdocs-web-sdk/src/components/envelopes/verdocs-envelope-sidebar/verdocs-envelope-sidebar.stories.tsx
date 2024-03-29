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
    another: {action: 'another'},
    envelopeUpdated: {action: 'envelopeUpdated'},
  },
} as Meta;

export const EnvelopeSidebar = ({envelopeId, toggle, another, envelopeUpdated}) =>
  html`<verdocs-envelope-sidebar .envelopeId=${envelopeId} @toggle=${toggle} @envelopeUpdated=${envelopeUpdated} @another=${another} />`;
