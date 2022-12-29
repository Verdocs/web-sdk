import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

// Circle with three dots in it
const CircleIcon = `
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

const ArrowIcon = `
<svg width="10" height="26" viewBox="0 0 10 26" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_31568_3647)">
<path d="M9.64682 13.431L2.10645 20.9466C1.86503 21.1853 1.47466 21.1853 1.23324 20.9466L0.216218 19.9411C-0.0251976 19.7025 -0.0251976 19.3165 0.216218 19.0778L6.30296 12.9993L0.216218 6.9208C-0.0251976 6.68213 -0.0251976 6.29619 0.216218 6.05752L1.23324 5.05205C1.47466 4.81338 1.86503 4.81338 2.10645 5.05205L9.64682 12.5677C9.88824 12.8064 9.88824 13.1923 9.64682 13.431Z"/>
</g>
<defs>
<clipPath id="clip0_31568_3647">
<rect width="9.86207" height="26"/>
</clipPath>
</defs>
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
    onClick: {
      action: 'click',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Button = ({label, size, variant, disabled, startIcon, endIcon, onClick}) =>
  html`<verdocs-button
    .label=${label}
    .size=${size}
    .variant=${variant}
    .disabled=${disabled}
    .startIcon=${startIcon ? CircleIcon : null}
    .endIcon=${endIcon ? ArrowIcon : null}
    @click=${onClick}
  />`;
