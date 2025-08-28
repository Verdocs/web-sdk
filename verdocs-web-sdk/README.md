# Verdocs Web SDK

> Library of components and embeds to quickly build Verdocs-enabled apps.

This is the core component library for a set of framework-specific SDKs to quickly develop Verdocs-enabled Web applications.
For more information, please see one of the following for your specific framework:

  - [Verdocs Web for React](https://www.npmjs.com/package/@verdocs/web-sdk-react)

---

## Vanilla JS Build & CDN Usage

A single-file Vanilla JS bundle is now available for direct use in any HTML/JavaScript project (no framework required). This bundle auto-defines all Verdocs custom elements globally.

### Building the Vanilla JS Bundle

1. Build the Stencil outputs (required for the bundle to work):
   ```bash
   npm run build
   ```
2. From the `verdocs-web-sdk` subdirectory, run:
   ```bash
   npx rollup -c rollup.config.mjs
   ```
   This will create `dist/verdocs-web-sdk-vanilla.js`, which can be used directly in the browser or via CDN.

3. Publish to npm as usual:
   ```bash
   npm publish
   ```

### Using via jsDelivr or CDNjs

After publishing to npm, the bundle will be available via CDN. Example (replace `x.y.z` with the latest version):

**jsDelivr:**
```html
<script src="https://cdn.jsdelivr.net/npm/@verdocs/web-sdk@x.y.z/dist/verdocs-web-sdk-vanilla.js"></script>
```

**CDNjs:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/verdocs-web-sdk/x.y.z/dist/verdocs-web-sdk-vanilla.js"></script>
```

Once included, all Verdocs custom elements will be available globally. Example usage:

```html
<verdocs-button label="Click me"></verdocs-button>
```

### Notes

- No changes to Stencil config were required for this bundle, and Storybook/framework SDK outputs are unaffected.
- For advanced usage or troubleshooting, see the StencilJS documentation on [custom elements bundles](https://stenciljs.com/docs/custom-elements).

