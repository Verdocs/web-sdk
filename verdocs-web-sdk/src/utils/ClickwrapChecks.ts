/**
 * Conspicuousness checks for verdocs-clickwrap. Courts look at whether terms were reasonably conspicuous, so we warn
 * developers in the console when the rendered component drifts from that, using a stable code per check so they can be
 * searched for or filtered. These never block: the customer owns their page and their legal call.
 */

export const CLICKWRAP_WARNINGS = {
  linkStyle: 'VERDOCS_CLICKWRAP_LINK_STYLE',
  textSize: 'VERDOCS_CLICKWRAP_TEXT_SIZE',
  contrast: 'VERDOCS_CLICKWRAP_CONTRAST',
  buttonLabel: 'VERDOCS_CLICKWRAP_BUTTON_LABEL',
} as const;

export type TClickwrapWarning = (typeof CLICKWRAP_WARNINGS)[keyof typeof CLICKWRAP_WARNINGS];

const MIN_TEXT_PX = 12;
const MIN_CONTRAST = 4.5; // WCAG AA for normal text

// rgb() and rgba() as getComputedStyle reports them. Anything else (named colors don't reach here) parses as null.
export const parseColor = (value: string): [number, number, number, number] | null => {
  const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/);
  if (!match) return null;
  const alpha = match[4] === undefined ? 1 : match[4].endsWith('%') ? parseFloat(match[4]) / 100 : parseFloat(match[4]);
  return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), alpha];
};

const luminance = ([r, g, b]: [number, number, number, number]) => {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

export const contrastRatio = (a: [number, number, number, number], b: [number, number, number, number]) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

// The first ancestor with a background that isn't transparent, or white when the page never sets one
const backgroundOf = (element: Element): [number, number, number, number] => {
  for (let node: Element | null = element; node; node = node.parentElement) {
    const color = parseColor(getComputedStyle(node).backgroundColor || '');
    if (color && color[3] > 0) return color;
  }
  return [255, 255, 255, 1];
};

/**
 * Run every check against a rendered verdocs-clickwrap and return the codes that failed. Each failure is also
 * reported once through `warn` (console.warn by default).
 */
export const runConspicuousnessChecks = (host: HTMLElement, warn: (message: string) => void = console.warn): TClickwrapWarning[] => {
  const failed = new Set<TClickwrapWarning>();
  const fail = (code: TClickwrapWarning, message: string) => {
    if (failed.has(code)) return;
    failed.add(code);
    warn(`[${code}] ${message}`);
  };

  host.querySelectorAll<HTMLElement>('[data-cw-link]').forEach(link => {
    const style = getComputedStyle(link);
    const underlined = (style.textDecorationLine || style.textDecoration || '').includes('underline');
    const parentColor = link.parentElement ? getComputedStyle(link.parentElement).color : style.color;
    if (!underlined && style.color === parentColor) {
      fail(CLICKWRAP_WARNINGS.linkStyle, 'A terms link has no underline and the same color as the text around it.');
    }
  });

  host.querySelectorAll<HTMLElement>('[data-cw-notice]').forEach(notice => {
    const style = getComputedStyle(notice);
    const size = parseFloat(style.fontSize || '');
    if (size && size < MIN_TEXT_PX) {
      fail(CLICKWRAP_WARNINGS.textSize, `Notice text is ${size}px; keep it at ${MIN_TEXT_PX}px or more.`);
    }

    const color = parseColor(style.color || '');
    if (color) {
      const ratio = contrastRatio(color, backgroundOf(notice));
      if (ratio < MIN_CONTRAST) {
        fail(CLICKWRAP_WARNINGS.contrast, `Notice text contrast is ${ratio.toFixed(2)}:1; keep it at ${MIN_CONTRAST}:1 or more.`);
      }
    }
  });

  const accept = host.querySelector<HTMLElement>('[data-cw-accept]');
  if (accept && !/agree|accept/i.test(accept.textContent || '')) {
    fail(CLICKWRAP_WARNINGS.buttonLabel, `The accept button says "${(accept.textContent || '').trim()}"; include "agree" or "accept".`);
  }

  return Array.from(failed);
};
