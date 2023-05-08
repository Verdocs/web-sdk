import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Templates/Template Tags',
  component: 'verdocs-template-tags',
  args: {
    tags: ['contractors', 'taxes', 'irs'],
  },
  argTypes: {},
} as Meta;

export const TemplateTags = ({tags, theme}) => html`<verdocs-template-tags .tags="${tags}" .theme="${theme}" />`;
