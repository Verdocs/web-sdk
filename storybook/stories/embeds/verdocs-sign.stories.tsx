import {html} from 'lit';
import {Meta} from '@storybook/web-components-vite';
import {loadStoryDefaults} from '../utils';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: loadStoryDefaults('embeds-sign', {
    envelopeId: '',
    roleId: '',
    inviteCode: '',
    toolbarStyle: 'controls',
  }),
  argTypes: {
    toolbarStyle: {
      control: 'select',
      options: ['controls', 'menu'],
      description: 'Toolbar Style',
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
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Sign = ({envelopeId, roleId, inviteCode, toolbarStyle}) =>
  !envelopeId || !roleId || !inviteCode
    ? html`<img src="https://public-assets.verdocs.com/sample-signing-envelope.png" alt="Document sample" />`
    : html`<verdocs-sign .envelopeId=${envelopeId} .roleId=${roleId} .inviteCode=${inviteCode} .toolbarStyle=${toolbarStyle} />`;
