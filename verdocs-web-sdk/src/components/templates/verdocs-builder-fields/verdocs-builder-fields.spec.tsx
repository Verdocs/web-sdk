import {newSpecPage} from '@stencil/core/testing';
import {VerdocsBuilderFields} from './verdocs-builder-fields';

describe('verdocs-builder-fields', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsBuilderFields],
      html: '<verdocs-builder-fields></verdocs-builder-fields>',
    });
    expect(page.root).toBeTruthy();
  });
});
