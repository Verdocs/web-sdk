import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

const dummyTemplate = {
  name: 'Lorem Ipsum',
  organization_business_name: 'John Doe, Inc.',
  organization_name: 'John Doe',
  star_counter: 52,
  pages: 409,
  counter: 19
}

export default {
  title: 'Controls/Template Card',
  component: 'template-card',
  args: {
    template: dummyTemplate
  },
  argTypes: {
    template: {type: 'object', control: 'object'},
    theme: {type: 'string', control: 'radio', options:['light', 'dark'], defaultValue: 'light'}
  },
} as Meta;

export const Default = ({template, theme}) => html`<template-card .template="${template}" .theme="${theme}"></template-card>`;
