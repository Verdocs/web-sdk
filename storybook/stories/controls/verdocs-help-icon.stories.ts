import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Help Icon',
  component: 'verdocs-help-icon',
  parameters: {},
  args: {
    text: 'Sample help text',
  },
  argTypes: {},
} as Meta;

export const HelpIcon = ({text}) => html`<verdocs-help-icon .text=${text} /> `;
