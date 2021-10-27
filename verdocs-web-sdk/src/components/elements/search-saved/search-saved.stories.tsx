import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Search/Saved',
  component: 'search-saved',
  args: {
    limit: 10,
  },
  argTypes: {
    entrySelected: {action: 'entrySelected'},
  },
} as Meta;

export const Default = ({limit, entrySelected}) => html`<search-saved .limit=${limit} @entrySelected=${entrySelected} />`;
