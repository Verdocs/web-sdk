import '../www/build/verdocs-web-sdk.css';

import {setupWorker} from 'msw';
import {handlers} from './mocks';
export const worker = setupWorker(...handlers);
worker
  .start()
  .then(() => {
    console.log('Started MSW');
  })
  .catch(e => {
    console.warn('Unable to start MSW', e);
  });

import {defineCustomElements} from '../dist/esm/loader';
defineCustomElements();

import {extractArgTypes, extractComponentDescription, setStencilDocJson} from '@pxtrn/storybook-addon-docs-stencil';
import docJson from '../dist/docs.json';
if (docJson) setStencilDocJson(docJson);

export const parameters = {
  // actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    hideNoControlsWarning: true,
    // Automatically consider args that start with color/date to be special controls
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // Automatically consider args that start with 'on' to be actions
  // actions: {argTypesRegex: '^on.*'},
  viewMode: 'docs',
  docs: {
    iframeHeight: 500,
    extractArgTypes,
    extractComponentDescription,
  },
};

// See https://github.com/storybookjs/storybook/issues/13128#issuecomment-798927176
function clickDocsButtonOnFirstLoad() {
  window.removeEventListener('load', clickDocsButtonOnFirstLoad);

  try {
    const docsButtonSelector = window.parent.document.evaluate("//button[contains(., 'Docs')]", window.parent.document, null, XPathResult.ANY_TYPE, null);

    const button = docsButtonSelector.iterateNext();

    button.click();
  } catch (error) {
    // Do nothing if it wasn't able to click on Docs button.
  }
}

window.addEventListener('load', clickDocsButtonOnFirstLoad);
