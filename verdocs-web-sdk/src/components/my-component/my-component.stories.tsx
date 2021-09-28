import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';
// import readme from './readme.md';

export default {
  title: 'Demo/My Component',
  // parameters: {
  //   notes: {
  //     markdown: readme,
  //   },
  // },
  argTypes: {
    // first: {description: 'First Name'},
    first: {type: 'string', control: 'text', description: 'First Name'},
    middle: {type: 'string', control: 'text', description: 'Middle Name'},
    last: {type: 'string', control: 'text', description: 'Last Name'},
  },
} as Meta;

export const MyComponent = ({first, middle, last}) => html`<my-component first="${first}" middle="${middle}" last="${last}"></my-component>`;
//
// const Template: Story = (args) => <my-component/>(args);
// // const Template: Story<Partial<ButtonProps>> = (args) => Button(args);
//
// export const Primary = Template.bind({});
// Primary.args = {
//   primary: true,
//   label: 'Button',
// };
//
// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Button',
// };
//
// export const Large = Template.bind({});
// Large.args = {
//   size: 'large',
//   label: 'Button',
// };
//
// export const Small = Template.bind({});
// Small.args = {
//   size: 'small',
//   label: 'Button',
// };
//
//
// // import readme from './readme.md';
// //
// // export default {
// //   title: 'Demo/My Component',
// //   parameters: {
// //     notes: {
// //       markdown: readme,
// //     },
// //   },
// //   argTypes: {
// //     first: {
// //       type: 'text',
// //       description: 'First name',
// //     },
// //     middle: {
// //       type: 'text',
// //       description: 'Middle name',
// //     },
// //     last: {
// //       type: 'text',
// //       description: 'Last name',
// //     },
// //   },
// // };
// //
// // // const Template = args => {
// // //   return <my-component {...args}></my-component>;
// // // };
// // //
// // // // export const Default = () => `
// // // //
// // // //   <my-component first="Millie" middle="Bobby" last="Brown"></my-component>
// // // // `;
// // //
// // // const defaultArgs = {
// // //   first: 'first',
// // //   middle: 'first',
// // //   last: 'first',
// // // };
// // //
// // // export const MyComponent = Template.bind({});
// // // Default.MyComponent = {...defaultArgs};
// // // import {setupStory, setupVariant, h, setupComposition} from '../../utils/storybook';
// // // import stencilStories from './stencil-stories';
// // //
// // // const Story = setupStory(stencilStories, {
// // //   category: 'Components/My Component',
// // //   argDefaults: {
// // //     modifier: '',
// // //     first: 'First',
// // //     middle: 'Middle',
// // //     last: 'Last',
// // //     hex: '#fba308',
// // //     boolean: false,
// // //     radio: '',
// // //   },
// // //   argOptions: {
// // //     modifier: ['default', 'modified'],
// // //     radio: ['default', 'loading', 'error', 'ready'],
// // //   },
// // //   argTypes: {
// // //     hex: {
// // //       control: 'color',
// // //     },
// // //     radio: {
// // //       control: {
// // //         type: 'inline-radio',
// // //         options: ['loading', 'error', 'ready'],
// // //       },
// // //     },
// // //   },
// // // });
// // //
// // // export const Default = setupVariant(Story);
// // // export const Modified = setupVariant(Story, {modifier: 'modified'});
// // //
// // // // look also inside the generated `stencil-stories.ts` file beneath your tsx or stories file.
// // // export const Slots = setupComposition(
// // //   `<slot's />`,
// // //   () => h`
// // //   ${['Single default slot', 'Slot default + <div slot="right">Named Slot</div>', h`<div slot="right">Use h wrapper, if there is reactive stuff inside of me</div>`].map(
// // //     slot => h`${Story.tplComposition({slot})}<br>`,
// // //   )}
// // // `,
// // // );
// // //
// // // export default Story;
