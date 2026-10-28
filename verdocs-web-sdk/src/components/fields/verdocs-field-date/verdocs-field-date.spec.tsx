import {h} from '@stencil/core';
import {newSpecPage} from '@stencil/core/testing';
import {VerdocsFieldDate} from './verdocs-field-date';

describe('verdocs-field-date', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldDate],
      html: '<verdocs-field-date></verdocs-field-date>',
    });
    expect(page.root).toBeTruthy();
  });

  it('flags a date outside the range its config allows', async () => {
    const render = (value: string, allowed: string) =>
      newSpecPage({
        components: [VerdocsFieldDate],
        template: () => <verdocs-field-date source="envelope" fieldname="start" field={{name: 'start', type: 'date', value, config: {type: 'date', allowed}} as any} />,
      });

    const early = await render('01/01/2020', 'future');
    expect(early.root.classList.contains('invalid')).toBe(true);
    expect(early.root.querySelector('.format-error')).toBeTruthy();

    const fine = await render('01/01/2020', 'past');
    expect(fine.root.classList.contains('invalid')).toBe(false);
    expect(fine.root.querySelector('.format-error')).toBeNull();
  });
});
