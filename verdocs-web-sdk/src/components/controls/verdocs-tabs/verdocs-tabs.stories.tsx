import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Tabs',
  component: 'verdocs-tabs',
  args: {
    tabs: [
      {id: 'tab1', label: 'Tab 1'},
      {id: 'tab2', label: 'Tab 2', disabled: true},
      {id: 'tab3', label: 'Tab 3'},
    ],
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Tabs = ({tabs}) => html`<verdocs-tabs .tabs=${tabs} />`;
