import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Controls/Quick Filter',
  component: 'verdocs-quick-filter',
  args: {
    options: [
      {label: 'All', value: 'all'},
      {label: 'Completed', value: 'completed'},
      {label: 'Inbox', value: 'inbox'},
    ],
    value: 'all',
    label: 'Filter',
    placeholder: 'Select...',
  },
} as Meta;

// TODO: Wrap the dropdown in a portal
export const QuickFilter = ({options, value, label, placeholder}) => html`
  <div style="height: 150px">
    <verdocs-quick-filter .options=${options} .value=${value} .label=${label} .placeholder=${placeholder} />
  </div>
`;
