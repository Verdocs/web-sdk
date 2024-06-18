import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Controls/Toggle Button',
  component: 'verdocs-toggle-button',
  args: {
    icon: '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>',
    label: 'Use',
    size: 'normal',
    active: false,
  },
  // argTypes: {
  //   options: {type: 'object', control: 'object'},
  //   theme: {type: 'string', control: 'radio', options:['light', 'dark'], defaultValue: 'light'}
  // },
} as Meta;

export const ToggleButton = ({icon, label, size, active}) => html`<verdocs-toggle-button .icon=${icon} .label=${label} .size=${size} .active=${active} />`;
