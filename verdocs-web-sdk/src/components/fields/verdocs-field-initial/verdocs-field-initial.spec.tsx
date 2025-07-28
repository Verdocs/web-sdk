import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldInitial } from './verdocs-field-initial';

describe('verdocs-field-initial', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldInitial],
      html: '<verdocs-field-initial></verdocs-field-initial>',
    });
    expect(page.root).toBeTruthy();
  });
});
