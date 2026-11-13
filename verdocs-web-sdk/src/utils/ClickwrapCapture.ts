/**
 * The theme variables verdocs-clickwrap reads. Their current values are written into the capture so the replay renders
 * in the colors the person actually saw, even though the customer's own stylesheet isn't part of it.
 */
export const CLICKWRAP_THEME_VARIABLES = [
  '--verdocs-primary-font',
  '--verdocs-primary-color',
  '--verdocs-primary-color-hover',
  '--verdocs-link-color',
  '--verdocs-button-radius',
  '--verdocs-button-disabled-bg',
  '--verdocs-button-disabled-color',
  '--verdocs-button-secondary-color',
  '--verdocs-checkbox-color',
  '--verdocs-dialog-backdrop-color',
  '--verdocs-dialog-radius',
  '--verdocs-clickwrap-text-color',
  '--verdocs-clickwrap-background',
  '--verdocs-clickwrap-border-color',
  '--verdocs-clickwrap-scroll-height',
];

export interface ILinkedTerms {
  name: string;
  content: string;
}

/**
 * Every CSS rule on the page that targets one of the given tags. Our components don't use shadow DOM, so their styles
 * live in the document's stylesheets. Stylesheets from another origin can't be read and are skipped; Stencil's own
 * styles are always inline, so nothing of ours is lost.
 */
export const collectRules = (tags: string[]) => {
  const rules: string[] = [];
  const visit = (list: CSSRuleList) => {
    for (const rule of Array.from(list)) {
      if ('cssRules' in rule && !(rule as CSSStyleRule).selectorText) {
        // @media and friends: keep the wrapper only if something inside it matched
        const before = rules.length;
        visit((rule as CSSGroupingRule).cssRules);
        if (rules.length > before && 'conditionText' in rule) {
          const inner = rules.splice(before).join('');
          rules.push(`@media ${(rule as CSSMediaRule).conditionText}{${inner}}`);
        }
        continue;
      }
      const selector = (rule as CSSStyleRule).selectorText;
      if (selector && tags.some(tag => selector.includes(tag))) {
        rules.push(rule.cssText);
      }
    }
  };

  for (const sheet of Array.from(document.styleSheets || [])) {
    try {
      visit(sheet.cssRules);
    } catch {
      // Cross-origin stylesheet
    }
  }
  return rules.join('\n');
};

/**
 * One self-contained HTML document of what the component rendered: its markup with live checkbox state, the CSS that
 * styles it, and the theme variables' current values. This is what the api stores, hashes, and replays.
 *
 * In inline mode, each agreement's text is only shown when the person opens its link, but the api checks that the
 * capture contains every version's text. We include that text in a hidden section marked as the linked terms, so the
 * check passes while the replay still shows only what was on screen.
 */
export const capturePresentation = (host: HTMLElement, linkedTerms: ILinkedTerms[] = []) => {
  const clone = host.cloneNode(true) as HTMLElement;

  // cloneNode copies attributes, not live properties. Without this every checkbox would replay as unchecked.
  const live = Array.from(host.querySelectorAll('input'));
  Array.from(clone.querySelectorAll('input')).forEach((input, index) => {
    const source = live[index];
    if (!source) return;
    source.checked ? input.setAttribute('checked', '') : input.removeAttribute('checked');
    source.disabled ? input.setAttribute('disabled', '') : input.removeAttribute('disabled');
  });

  const computed = getComputedStyle(host);
  const variables = CLICKWRAP_THEME_VARIABLES.map(name => [name, computed.getPropertyValue(name).trim()])
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}: ${value};`)
    .join(' ');

  const linked = linkedTerms.length
    ? `<section data-verdocs-linked-terms hidden>${linkedTerms
        .map(terms => `<article data-verdocs-linked-agreement="${escapeAttribute(terms.name)}">${terms.content}</article>`)
        .join('')}</section>`
    : '';

  return [
    '<!doctype html>',
    '<html><head><meta charset="utf-8">',
    `<style>:root { ${variables} }\n${collectRules(['verdocs-clickwrap'])}</style>`,
    '</head><body>',
    clone.outerHTML,
    linked,
    '</body></html>',
  ].join('');
};

const escapeAttribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
