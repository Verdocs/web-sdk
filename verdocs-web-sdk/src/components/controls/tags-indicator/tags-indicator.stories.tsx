import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Elements/Tags Indicator',
  component: 'tags-indicator',
  args: {
    tags: ['contractors', 'taxes', 'irs']
  },
  argTypes: {
    tags: {type: 'array', control: 'object'},
    theme: {type: 'string', control: 'radio', options:['light', 'dark'], defaultValue: 'light'}
  },
} as Meta;

export const Default = ({tags, theme}) => html`<tags-indicator .tags="${tags}" .theme="${theme}"></tags-indicator>`;
