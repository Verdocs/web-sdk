import {CLICKWRAP_WARNINGS, contrastRatio, parseColor, runConspicuousnessChecks} from './ClickwrapChecks';

describe('ClickwrapChecks', () => {
  it('parses the colors getComputedStyle reports', () => {
    expect(parseColor('rgb(255, 255, 255)')).toEqual([255, 255, 255, 1]);
    expect(parseColor('rgba(0, 0, 0, 0.5)')).toEqual([0, 0, 0, 0.5]);
    expect(parseColor('rgb(10 20 30 / 50%)')).toEqual([10, 20, 30, 0.5]);
    expect(parseColor('transparent')).toBeNull();
  });

  it('computes WCAG contrast ratios', () => {
    expect(contrastRatio([0, 0, 0, 1], [255, 255, 255, 1])).toBeCloseTo(21, 0);
    expect(contrastRatio([119, 119, 119, 1], [255, 255, 255, 1])).toBeCloseTo(4.48, 1);
    expect(contrastRatio([255, 255, 255, 1], [255, 255, 255, 1])).toBe(1);
  });

  it('warns once, with its code, when the accept label has neither "agree" nor "accept"', () => {
    const host = document.createElement('div');
    host.innerHTML = '<button data-cw-accept>Continue</button>';
    const warn = jest.fn();

    expect(runConspicuousnessChecks(host, warn)).toEqual([CLICKWRAP_WARNINGS.buttonLabel]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`[${CLICKWRAP_WARNINGS.buttonLabel}]`));
  });

  it('accepts labels that say agree or accept', () => {
    const host = document.createElement('div');
    host.innerHTML = '<button data-cw-accept>I Agree</button>';

    expect(runConspicuousnessChecks(host, jest.fn())).toEqual([]);
  });
});
