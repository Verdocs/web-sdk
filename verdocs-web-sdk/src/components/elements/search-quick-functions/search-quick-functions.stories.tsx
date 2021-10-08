import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {action} from '@storybook/addon-actions';

export default {
  title: 'Elements/Search/Quick Functions',
  component: 'search-quick-functions',
  args: {},
  argTypes: {},
} as Meta;

const listener = {
  handleEvent(e) {
    action('selected', e);
  },
  capture: true,
};

export const Default = ({options}) => html`<search-quick-functions .options=${options} @optionSelected=${listener} tall />`;
