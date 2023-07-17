import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Envelopes/Envelope Sidebar',
  component: 'verdocs-envelope-sidebar',
  args: {
    envelopeId: 'c64b09c1-23d8-4612-bc66-86723ab7ede3',
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
