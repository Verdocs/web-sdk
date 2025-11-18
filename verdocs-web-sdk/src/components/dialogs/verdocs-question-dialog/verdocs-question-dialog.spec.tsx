import {newSpecPage} from '@stencil/core/testing';
import {VerdocsQuestionDialog} from './verdocs-question-dialog';

describe('verdocs-question-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuestionDialog],
      html: '<verdocs-question-dialog></verdocs-question-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
