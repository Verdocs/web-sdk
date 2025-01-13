import { Plugin } from 'vue';
import { applyPolyfills, defineCustomElements } from '@verdocs/web-sdk/dist/loader';

export const ComponentLibrary: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};
