import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Build',
  component: 'verdocs-build',
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Build = ({}) => html`<verdocs-build />`;
