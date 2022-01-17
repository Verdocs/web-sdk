import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Search/Saved Searches',
  component: 'search-saved',
  args: {
    limit: 10,
  },
  argTypes: {
    entrySelected: {action: 'entrySelected'},
  },
} as Meta;

export const SavedSearches = ({limit, entrySelected}) => html`<search-saved .limit=${limit} @entrySelected=${entrySelected} />`;
