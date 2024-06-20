# Verdocs Web SDK Storybook

This sub-project provides a simple Storybook-driven catalog to view
documentation and examples for components in the Verdocs Web SDK. 
The components themselves are developed and built in StencilJS in
the `../verdocs-web-sdk` subdirectory.

A typical development workflow would be as follows:
1. In `../verdocs-web-sdk`, run `npm i` and then `npm start` to
  start a development server that watches the project and automatically
  rebuilds it when components change.
2. In another terminal, run `npm i` and then `npm run storybook` in this
  folder to watch for and rebuild any changes in the parent project as well 
  as story edits here.

