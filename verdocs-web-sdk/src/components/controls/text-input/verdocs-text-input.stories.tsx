import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Inputs',
  component: 'verdocs-text-input',
  args: {
    label: 'Name',
    value: '',
    placeholder: 'Enter your name...'
  },
  argTypes: {
    tinput: {
      action: 'tinput',
      table: {
        disable: true,
      },
    },
    tfocus: {
      action: 'tfocus',
      table: {
        disable: true,
      },
    },
    tblur: {
      action: 'tblur',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const TextInput = ({type, label, value, placeholder, tinput, tfocus, tblur}) =>
  html`<verdocs-text-input .type=${type} .label=${label} .placeholder=${placeholder} .value=${value} @tinput=${tinput} @tfocus=${tfocus} @tblur=${tblur} />`;
