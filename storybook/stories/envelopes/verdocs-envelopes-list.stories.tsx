import {Meta} from '@storybook/web-components-vite';
import {html} from 'lit-html';

export default {
  title: 'Envelopes/Envelopes List',
  component: 'verdocs-envelopes-list',
  args: {
    items: 10,
    view: 'all',
    sortBy: 'updated_at',
  },
  argTypes: {
    onViewEnvelope: {action: 'viewEnvelope'},
    onFinishLater: {action: 'finishLater'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const EnvelopesList = ({items, view, sortBy, onViewEnvelope, onFinishLater}) =>
  html`<verdocs-envelopes-list .items="${items}" .view="${view}" .sortBy="${sortBy}" @viewEnvelope=${onViewEnvelope} @finishlater=${onFinishLater} />`;
