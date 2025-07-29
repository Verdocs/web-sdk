import { newSpecPage } from '@stencil/core/testing';
import { VerdocsProgressBar } from './verdocs-progress-bar';
import { h } from '@stencil/core';

describe('verdocs-progress-bar', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsProgressBar],
      template: () => <verdocs-progress-bar></verdocs-progress-bar>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with label and percent', async () => {
    const page = await newSpecPage({
      components: [VerdocsProgressBar],
      template: () => <verdocs-progress-bar label="Uploading..." percent={54}></verdocs-progress-bar>,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.label).toBe('Uploading...');
    expect(page.rootInstance.percent).toBe(54);
  });

  it('renders with showPercent true', async () => {
    const page = await newSpecPage({
      components: [VerdocsProgressBar],
      template: () => <verdocs-progress-bar label="Loading..." percent={75} showPercent={true}></verdocs-progress-bar>,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.showPercent).toBe(true);
    expect(page.rootInstance.percent).toBe(75);
  });
});
