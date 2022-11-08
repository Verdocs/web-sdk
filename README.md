# Verdocs Web Components SDK

This repository contains UI controls and components for building rich Verdocs-enabled document signing experiences for the Web. Components
are built in [StencilJS](https://stenciljs.com/) for maximum portability between front-end frameworks. A wide variety of client frameworks
are supported:

- React - Via `verdocs-web-sdk-react`
- Angular - Via `verdocs-web-sdk-angular`
- VueJS - Imported directly from `verdocs-web-sdk`. See the [StencilJS Vue Integration](https://stenciljs.com/docs/vue) for instructions.
- Standard Javascript - See the StencilJS [Components without a Framework](https://stenciljs.com/docs/javascript) guide for more information.

## Styles and Fonts

Most of the widgets in this library specify "Barlow" as the default font, but do not include it as a dependency to keep the package size
as small as possible. To support Barlow in your own app, including the following lines of code in your `<head>` tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&display=swap" rel="stylesheet">
```

## Development

Work on this project requires an up-to-date (LTS is recommended) NodeJS installation. There are three main directories:

- `verdocs-web-sdk` - The main project for all components. This also provides a Storybook interface for previewing controls as they are 
  developed.
- `verdocs-web-sdk-angular` - A helper project for publishing the AngularJS-specific package.
- `verdocs-web-sdk-react` - A helper project for publishing the React-specific package.

Note that the downstream projects do not "pull" from the main library. Instead, when a build is run, the StencilJS compiler is configured
to push changes into the downstream projects. Therefore, a build must be run in the parent project before the child projects are published.

If building on a Mac you will need Cairo and Pango installed:

    brew install cairo pango

### External dependencies

To minimize external dependencies, license conflicts, and related issues, third-party libraries and other dependencies should be avoided.
For example, while Verdocs licenses FontAwesome Pro for its own purposes, that library should not be included here. Instead, use only free
or Open Source icons and other tools. Support for SVG asset compilation/inclusion is enabled in the project - see `DropdownMenu` for a
working example.

### Creating components

To create or update a component it is best to use the generator command:

    npm run generate

When asked, provide a kebab-style component name, and leave the Stylesheet/Spec/E2E options enabled (the default). This will generate
the required skeleton files for you in `src/components`. Move the folder created to the appropriate subdirectory:

- `controls` - Low level UI controls such as drop-downs, buttons, etc. UI controls should be 100% independent from one another. If
  a control requires data to operate properly, it should be passed in as a property (controls should not call the API directly).
- `elements` - Elements are widgets that combine one or more controls and potentially additional business logic into a functional unit,
  such as a search result entry, a Template preview "card", or a document "actions" menu (with appropriate logic to hide/show certain
  options that may not be available based on the document's state). Elements are more complex than simple controls, but still require the
  parent to provide some data, control, and business logic.
- `embeds` - Embeds are fully functional "mini-apps". If provided with appropriate configurations (e.g API endpoints and authorization
  details) they can be used to represent entire experiences such as document preview, document signing, or search.
