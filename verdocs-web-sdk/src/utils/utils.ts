// These should probably all move to JS-SDK
export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export const integerSequence = (start: number, count: number): number[] =>
  Array(count)
    .fill(1)
    .map((_, index) => index + start);

export const fullNameToInitials = (name: string) =>
  name
    .split(' ')
    .map(word => word[0])
    .join('');
