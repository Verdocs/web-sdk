import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {action} from '@storybook/addon-actions';

/**
 * Display a list of saved searches.
 */
export default {
  title: 'Elements/Search/Saved',
  component: 'search-saved',
  args: {},
  argTypes: {},
} as Meta;

const listener = {
  handleEvent(e) {
    action('selected', e);
  },
  capture: true,
};

export const Default = ({options}) => html`<search-saved .options=${options} @optionSelected=${listener} tall />`;
