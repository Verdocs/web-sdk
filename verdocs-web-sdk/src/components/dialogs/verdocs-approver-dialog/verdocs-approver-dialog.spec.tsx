import { newSpecPage } from '@stencil/core/testing';
import { VerdocsApproverDialog } from './verdocs-approver-dialog';

describe('verdocs-approver-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsApproverDialog],
      html: '<verdocs-approver-dialog></verdocs-approver-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
