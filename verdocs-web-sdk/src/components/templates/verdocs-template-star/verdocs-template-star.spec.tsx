import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateStar } from './verdocs-template-star';

describe('verdocs-template-star', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateStar],
      html: '<verdocs-template-star></verdocs-template-star>',
    });
    expect(page.root).toBeTruthy();
  });
});
