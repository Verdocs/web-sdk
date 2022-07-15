import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Search/Search Box',
  component: 'verdocs-search-box',
  args: {
    type: 'all',
  },
  argTypes: {
    searchClicked: {action: 'searchClicked'},
    typeChanged: {action: 'typeChanged'},
    queryChanged: {action: 'queryChanged'},
    type: {type: 'string', control: 'radio', options: ['all', 'document', 'template', 'organization']},
  },
} as Meta;

export const SearchBox = ({type, searchClicked, typeChanged, queryChanged}) =>
  html`<verdocs-search-box .type=${type} @searchClicked=${searchClicked} @typeChanged=${typeChanged} @queryChanged=${queryChanged} />`;
