# Verdocs Vue SDK

> Library of components and embeds to quickly build Verdocs-enabled apps in Vue.

This SDK provides UI controls and components for building rich, Verdocs-enabled document signing experiences for the Web. Components
are built in [StencilJS](https://stenciljs.com/) for maximum portability between front-end frameworks. This package contains the
Vue framework components - for React or Angular, please see the parent repository.

## Installation

Begin by installing the SDK into your app. Currently Vue >= 3 is supported. Although it is not required,
it is recommended to install the Verdocs JS SDK as well, as it provides the underlying API access for 
the components in this package.

    npm i -S @verdocs/web-sdk-vue @verdocs/js-sdk

Next, per the instructions at [Vue and Web Components](https://vuejs.org/guide/extras/web-components#example-vite-config), configure the Vue plugin for Vite to support
custom components by adding the following to your `vite.config.js`:

```javascript
...

export default defineConfig({
  plugins: [
    vue({ 
      // Add this configuration block
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    }),
    ...
  ],
  ...
})

````

Finally, register the Verdocs Web SDK with Vue by adding the following to your `App.vue`:

```javascript
...
import {ComponentLibrary, VerdocsAuth} from '@verdocs/web-sdk-vue';
...

if (ComponentLibrary?.install) {
ComponentLibrary.install();
}
````

## Usage

Verdocs Web Components may be used like any other custom component in Vue. The only adjustment to
keep in mind is that the component name must be in kebab-case, and event handlers must omit the `on`
prefix, e.g.:

```vue
  <verdocs-templates-list 
    @viewTemplate="(event) => console.log('Selected', event.detail)" 
  />
```
