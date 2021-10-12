import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {action} from '@storybook/addon-actions';

/**
 * Display a list of starred items (favorite templates).
 */
export default {
  title: 'Elements/Search/Starred',
  component: 'search-starred',
  args: {},
  argTypes: {},
} as Meta;

const listener = {
  handleEvent(e) {
    action('selected', e);
  },
  capture: true,
};

export const Default = ({options}) => html`<search-starred .options=${options} @optionSelected=${listener} tall />`;
