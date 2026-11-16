import {newSpecPage} from '@stencil/core/testing';
import {VerdocsAdoptSignatureDialog} from './verdocs-adopt-signature-dialog';

describe('verdocs-adopt-signature-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsAdoptSignatureDialog],
      html: '<verdocs-adopt-signature-dialog></verdocs-adopt-signature-dialog>',
    });
    expect(page.root).toBeTruthy();
  });

  it('tolerates a cleared name', async () => {
    const page = await newSpecPage({
      components: [VerdocsAdoptSignatureDialog],
      html: '<verdocs-adopt-signature-dialog name="Jane Smith"></verdocs-adopt-signature-dialog>',
    });
    const dialog = page.rootInstance as VerdocsAdoptSignatureDialog;
    expect(dialog.enteredInitials).toEqual('JS');

    for (const value of ['', '   ']) {
      expect(() => dialog.handleNameChange({target: {value}})).not.toThrow();
      expect(dialog.enteredInitials).toEqual('');
    }
  });
});
