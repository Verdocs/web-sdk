import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {action} from '@storybook/addon-actions';

const dummyData = [
  { params: {q: 'AGNT'} }, { params: {q: 'W9'}, }, { params: {q: 'leasing agreement', type: 'template'}, }, { params: { q: 'verdocs template' } }
]

export default {
  title: 'Elements/Search/Recent',
  component: 'search-recent',
  args: {
    options: dummyData
  },
  argTypes: {},
} as Meta;

const listener = {
  handleEvent(e) {
    action('selected', e);
  },
  capture: true,
};

export const Default = ({options}) => html`<search-recent .options=${options} @optionSelected=${listener} tall />`;
