import {newSpecPage} from '@stencil/core/testing';
import {VerdocsQuickFunctions} from '../verdocs-quick-functions';
import {h} from '@stencil/core';

describe('search-quick-functions', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFunctions],
      template: () => <verdocs-quick-functions></verdocs-quick-functions>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
