import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Progress Bar',
  args: {
    label: 'Uploading...',
    showPercent: true,
    percent: 54,
  },
} as Meta;

export const ProgressBar = ({label, showPercent, percent}) => html`<verdocs-progress-bar .label=${label} .showPercent=${showPercent} .percent=${percent} />`;
