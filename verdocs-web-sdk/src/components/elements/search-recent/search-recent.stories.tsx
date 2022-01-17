import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Search/Recent Searches',
  component: 'search-recent',
  args: {
    limit: 10,
  },
  argTypes: {
    entrySelected: {action: 'entrySelected'},
  },
} as Meta;

export const RecentSearches = ({limit, entrySelected}) => html`<search-recent .limit=${limit} @entrySelected=${entrySelected} />`;
