// import {fas} from '@fortawesome/free-solid-svg-icons';
// import {library} from '@fortawesome/fontawesome-svg-core';

// library.add(fas);

import {defineCustomElements} from '../dist/esm/loader';
defineCustomElements();

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewMode: 'docs',
  docs: {iframeHeight: 500},
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
