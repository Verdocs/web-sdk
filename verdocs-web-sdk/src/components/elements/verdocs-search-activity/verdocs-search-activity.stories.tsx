import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

/**
 * Display a list of starred items (favorite templates).
 */
export default {
  title: 'Elements/Search/Search Activity',
  component: 'verdocs-search-activity',
  args: {},
  argTypes: {
    type: {defaultValue: 'recent'},
    entrySelected: {action: 'entrySelected'},
  },
} as Meta;

export const SearchActivity = ({type, entrySelected}) => html`<verdocs-search-activity .type=${type} @entrySelected=${entrySelected} tall />`;
