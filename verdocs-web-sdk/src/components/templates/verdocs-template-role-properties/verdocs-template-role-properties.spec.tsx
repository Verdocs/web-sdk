import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateRoleProperties } from './verdocs-template-role-properties';

describe('verdocs-template-role-properties', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateRoleProperties],
      html: '<verdocs-template-role-properties></verdocs-template-role-properties>',
    });
    expect(page.root).toBeTruthy();
  });
});
