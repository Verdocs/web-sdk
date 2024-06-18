import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {action} from '@storybook/addon-actions';

export default {
  title: 'Embeds/Search',
  component: 'verdocs-search',
  args: {},
  argTypes: {},
} as Meta;

const listener = {
  handleEvent(e) {
    action('selected', e);
  },
  capture: true,
};

export const Search = ({options}) => html`<verdocs-search .options=${options} @optionSelected=${listener} tall />`;
