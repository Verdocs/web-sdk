import interact from 'interactjs';

export const SNAP_PX = 5;

// The resize modifier that pulls a dragged edge onto a nearby edge of another field on the page, in page coordinates.
export const snapToFields = (el: HTMLElement) =>
  interact.modifiers.snapEdges({
    targets: [
      (x: number, y: number, interaction: any) => {
        const edges = interaction.prepared?.edges || {};
        const others = [...(el.parentElement?.querySelectorAll('.verdocs-field') || [])].filter(other => other !== el).map(other => other.getBoundingClientRect());
        const nearest = (value: number, candidates: number[]) => {
          const best = candidates.reduce<number | null>((found, candidate) => (found === null || Math.abs(candidate - value) < Math.abs(found - value) ? candidate : found), null);
          return best !== null && Math.abs(best - value) <= SNAP_PX ? best : undefined;
        };

        const xs = others.flatMap(other => [other.left + window.scrollX, other.right + window.scrollX]);
        const ys = others.flatMap(other => [other.top + window.scrollY, other.bottom + window.scrollY]);
        const snapX = edges.left || edges.right ? nearest(x, xs) : undefined;
        const snapY = edges.top || edges.bottom ? nearest(y, ys) : undefined;
        if (snapX === undefined && snapY === undefined) {
          return null;
        }

        return {[edges.left ? 'left' : 'right']: snapX, [edges.top ? 'top' : 'bottom']: snapY, range: SNAP_PX * 2};
      },
    ],
  });
