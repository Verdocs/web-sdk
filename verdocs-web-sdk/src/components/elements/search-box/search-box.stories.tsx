import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Search/Search Box',
  component: 'search-box',
  args: {
    type: 'all',
  },
  argTypes: {
    search: {action: 'search'},
    type: {type: 'string', control: 'radio', options: ['all', 'document', 'template', 'organization']},
  },
} as Meta;

export const Default = ({type, search}) => html`<search-box .type=${type} @search=${search} />`;
