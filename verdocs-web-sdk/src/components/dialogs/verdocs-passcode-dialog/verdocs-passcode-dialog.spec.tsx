import {newSpecPage} from '@stencil/core/testing';
import {VerdocsPasscodeDialog} from './verdocs-passcode-dialog';

describe('verdocs-passcode-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsPasscodeDialog],
      html: '<verdocs-passcode-dialog></verdocs-passcode-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
