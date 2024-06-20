import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

const dummyOptions = {
  label: 'View as',
  defaultSelection: 1,
  buttons: [
    {
      id: 'list-view',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><rect fill="none" height="24" width="24"/><path d="M3,5v14h18V5H3z M7,7v2H5V7H7z M5,13v-2h2v2H5z M5,15h2v2H5V15z M19,17H9v-2h10V17z M19,13H9v-2h10V13z M19,9H9V7h10V9z"/></svg>',
    },
    {
      id: 'grid-view',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 5v14h19V5H3zm17 4h-2.25V7H20v2zM9.25 11h2.25v2H9.25v-2zm-2 2H5v-2h2.25v2zm4.25-4H9.25V7h2.25v2zm2-2h2.25v2H13.5V7zm-2 8v2H9.25v-2h2.25zm2 0h2.25v2H13.5v-2zm0-2v-2h2.25v2H13.5zm4.25-2H20v2h-2.25v-2zM7.25 7v2H5V7h2.25zM5 15h2.25v2H5v-2zm12.75 2v-2H20v2h-2.25z"/></svg>',
    },
  ],
};

export default {
  title: 'Controls/Toggle',
  component: 'verdocs-toggle',
  parameters: {},
  args: {
    options: dummyOptions,
  },
  // argTypes: {
  //   options: {type: 'object', control: 'object'},
  //   theme: {type: 'string', control: 'radio', options:['light', 'dark'], defaultValue: 'light'}
  // },
} as Meta;

export const Toggle = ({options, theme}) => html`<verdocs-toggle .options=${options} .theme=${theme}></verdocs-toggle>`;
