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
};
