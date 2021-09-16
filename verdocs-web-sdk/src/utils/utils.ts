export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export const integerSequence = (start: number, count: number): number[] =>
  Array(count)
    .fill(1)
    .map((_, index) => index + start);
