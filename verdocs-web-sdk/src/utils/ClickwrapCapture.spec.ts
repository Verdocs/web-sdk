import {capturePresentation, collectRules} from './ClickwrapCapture';

// The mock DOM has no stylesheets, so we hand it a stand-in list shaped like CSSOM
const useStyleSheets = (sheets: unknown[]) => Object.defineProperty(document, 'styleSheets', {configurable: true, value: sheets});

const rule = (selectorText: string) => ({selectorText, cssText: `${selectorText} { color: red; }`});

describe('ClickwrapCapture', () => {
  afterEach(() => useStyleSheets([]));

  it('collects only the rules that target the given tags, inside @media too', () => {
    useStyleSheets([
      {cssRules: [rule('verdocs-clickwrap .cw-terms'), rule('.unrelated')]},
      {cssRules: [{conditionText: '(max-width: 600px)', cssRules: [rule('verdocs-clickwrap .cw-dialog'), rule('.other')]}]},
    ]);

    const css = collectRules(['verdocs-clickwrap']);

    expect(css).toContain('verdocs-clickwrap .cw-terms { color: red; }');
    expect(css).toContain('@media (max-width: 600px){verdocs-clickwrap .cw-dialog { color: red; }}');
    expect(css).not.toContain('.unrelated');
    expect(css).not.toContain('.other');
  });

  it('skips stylesheets it is not allowed to read', () => {
    const crossOrigin = {
      get cssRules(): never {
        throw new Error('SecurityError');
      },
    };
    useStyleSheets([crossOrigin, {cssRules: [rule('verdocs-clickwrap')]}]);

    expect(collectRules(['verdocs-clickwrap'])).toContain('verdocs-clickwrap { color: red; }');
  });

  it('copies live checkbox state and adds hidden linked terms when given', () => {
    useStyleSheets([{cssRules: [rule('verdocs-clickwrap .cw-check')]}]);
    const host = document.createElement('verdocs-clickwrap');
    host.innerHTML = '<label><input type="checkbox"><span>I agree to the Terms</span></label><label><input type="checkbox"></label>';
    const [first, second] = Array.from(host.querySelectorAll('input'));
    first.checked = true;
    second.disabled = true;

    const html = capturePresentation(host, [{name: 'Terms "A"', content: '<p>Full terms.</p>'}]);

    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('verdocs-clickwrap .cw-check { color: red; }');
    expect(html).toMatch(/<input type="checkbox" checked(="")?>/);
    expect(html).toMatch(/<input type="checkbox" disabled(="")?>/);
    expect(html).toContain('<section data-verdocs-linked-terms hidden><article data-verdocs-linked-agreement="Terms &quot;A&quot;"><p>Full terms.</p></article></section>');
  });
});
