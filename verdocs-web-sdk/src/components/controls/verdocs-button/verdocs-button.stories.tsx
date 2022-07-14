import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

// Circle with three dots in it
const Icon1 = `
  <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff">
    <g>
      <rect fill="none" height="24" width="24"/>
    </g>
    <g>
      <g>
        <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M12,20c-4.42,0-8-3.58-8-8 c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z"/>
        <circle cx="7" cy="12" r="1.5"/>
        <circle cx="12" cy="12" r="1.5"/>
        <circle cx="17" cy="12" r="1.5"/>
      </g>
    </g>
  </svg>
`;

export default {
  title: 'Controls/Button',
  component: 'verdocs-button',
  args: {
    label: 'Click Me',
    type: 'button',
    size: 'normal',
    variant: 'standard',
    disabled: false,
  },
  argTypes: {
    startIcon: {defaultValue: false, control: {type: 'boolean'}},
    endIcon: {defaultValue: false, control: {type: 'boolean'}},
    press: {
      action: 'press',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Button = ({label, size, variant, disabled, startIcon, endIcon, press}) =>
  html`<verdocs-button
    .label=${label}
    .startIcon=${startIcon ? Icon1 : null}
    .endIcon=${endIcon ? Icon1 : null}
    .size=${size}
    .variant=${variant}
    .disabled=${disabled}
    @press=${press}
  />`;
