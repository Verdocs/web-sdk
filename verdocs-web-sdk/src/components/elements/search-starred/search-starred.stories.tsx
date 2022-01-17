import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

const dummyData = [
  {
    params: {q: 'COVID-19 Verdocs Health Certificate'},
    pages: 1,
    recipients: 1,
  },
  {
    params: {q: 'Verdocs NDA', type: 'template'},
    pages: 1,
    recipients: 2,
  },
  {
    params: {q: 'AGNT Verdocs MSA', type: 'template'},
    recipients: ['Pierce Alizadeh', 'Patrick Haney'],
  },
  {
    params: {q: 'Verdocs Template', type: 'template'},
    pages: 2,
  },
];

/**
 * Display a list of starred items (favorite templates).
 */
export default {
  title: 'Elements/Search/Starred Items',
  component: 'search-starred',
  args: {
    options: dummyData,
  },
  argTypes: {
    entrySelected: {action: 'entrySelected'},
  },
} as Meta;

export const StarredItems = ({options, entrySelected}) => html`<search-starred .options=${options} @entrySelected=${entrySelected} tall />`;
