/**
 * Toggle `scrollable` and `at-end` on the wrapper of a scrolling body so a CSS fade can show
 * only while there is more content below the fold.
 */
export function updateScrollFade(body: HTMLElement | null | undefined) {
  const wrap = body?.parentElement;
  if (!body || !wrap) {
    return;
  }

  const scrollable = body.scrollHeight > body.clientHeight + 1;
  const atEnd = body.scrollTop + body.clientHeight >= body.scrollHeight - 1;
  wrap.classList.toggle('scrollable', scrollable);
  wrap.classList.toggle('at-end', atEnd);
}
