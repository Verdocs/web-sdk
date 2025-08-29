import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Controls/Table',
  component: 'verdocs-table',
  parameters: {},
  args: {
    columns: [
      {id: 'id', header: 'ID'},
      {id: 'name', header: 'Name'},
      {
        id: 'date',
        header: 'Date',
        renderHeader: () => 'Past Due Since',
        renderCell: (_, row) => `<span style="color: red">${new Date(row.date).toLocaleDateString()}</a>`,
      },
    ],
    data: [
      {id: '123', name: 'Test 1', date: new Date()},
      {id: '456', name: 'Test 2', date: new Date()},
    ],
  },
} as Meta;

export const Table = ({columns, data}) => html`<verdocs-table .columns=${columns} .data=${data} />`;
