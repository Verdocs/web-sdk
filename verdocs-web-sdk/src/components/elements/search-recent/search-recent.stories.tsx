import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Search/Recent',
  component: 'search-recent',
  args: {
    limit: 10,
  },
  argTypes: {
    entrySelected: {action: 'entrySelected'},
  },
} as Meta;

export const Default = ({limit, entrySelected}) => html`<search-recent .limit=${limit} @entrySelected=${entrySelected} />`;
