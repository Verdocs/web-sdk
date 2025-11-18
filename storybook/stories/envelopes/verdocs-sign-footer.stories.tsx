import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';
import {loadStoryDefaults} from '../utils';

export default {
  title: 'Envelopes/Sign Footer',
  component: 'verdocs-sign-footer',
  args: loadStoryDefaults('envelopes-sign-footer', {
    envelopeId: '',
  }),
  argTypes: {
    envelopeId: {name: 'envelopeId'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const SignFooter = ({envelopeId}) =>
  html` <div style="width:600px;height:400px;">
    <verdocs-sign-footer .envelopeId="${envelopeId}" />
  </div>`;
