# Verdocs Web Components SDK

This repository contains UI controls and components for building rich Verdocs-enabled document signing experiences for the Web. Components
are built in [StencilJS](https://stenciljs.com/) for maximum portability between front-end frameworks. A wide variety of client frameworks
are supported:

- React - Via `verdocs-web-sdk-react`
- Angular - Via `verdocs-web-sdk-angular`
- VueJS - Imported directly from `verdocs-web-sdk`. See the [StencilJS Vue Integration](https://stenciljs.com/docs/vue) for instructions.
- Standard Javascript - See the StencilJS [Components without a Framework](https://stenciljs.com/docs/javascript) guide for more information.

## Development

Work on this project requires an up-to-date (LTS is recommended) NodeJS installation. There are three main directories:

- `verdocs-web-sdk` - The main project for all components. This also provides a Storybook interface for previewing controls as they are 
  developed.
- `verdocs-web-sdk-angular` - A helper project for publishing the AngularJS-specific package.
- `verdocs-web-sdk-react` - A helper project for publishing the React-specific package.

Note that the downstream projects do not "pull" from the main library. Instead, when a build is run, the StencilJS compiler is configured
to push changes into the downstream projects. Therefore, a build must be run in the parent project before the child projects are published.

### External dependencies

To minimize external dependencies, license conflicts, and related issues, third-party libraries and other dependencies should be avoided.
For example, while Verdocs licenses FontAwesome Pro for its own purposes, that library should not be included here. Instead, use only free
or Open Source icons and other tools. Support for SVG asset compilation/inclusion is enabled in the project - see `DropdownMenu` for a
working example.

### Creating components

To create or update a component
