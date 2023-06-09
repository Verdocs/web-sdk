import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Pagination',
  component: 'verdocs-pagination',
  args: {
    selectedPage: 0,
    itemCount: 37,
    perPage: 10,
    argTypes: {
      onSelectPage: {action: 'selectPage'},
    },
  },
} as Meta;

export const Pagination = ({selectedPage, itemCount, perPage, onSelectPage}) => html`<verdocs-pagination
  .selectedPage=${selectedPage}
  .itemCount=${itemCount}
  .perPage=${perPage}
  @selectPage=${onSelectPage}
/>`;
