import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {action} from '@storybook/addon-actions';

/**
 * Display a set of tabs to filter by searchable content types.
 */
export default {
  title: 'Search/Tabs',
  component: 'verdocs-search-tabs',
  args: {},
  argTypes: {},
} as Meta;

const listener = {
  handleEvent(e) {
    action('selected', e);
  },
  capture: true,
};

export const Tabs = ({options}) => html`<verdocs-search-tabs .options=${options} @optionSelected=${listener} tall />`;
