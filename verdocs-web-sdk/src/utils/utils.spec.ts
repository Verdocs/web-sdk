import {fullNameToInitials, integerSequence} from './utils';

describe('utils', () => {
  it('integerSequence returns a sequence of integers', () => {
    expect(integerSequence(1, 3)).toEqual([1, 2, 3]);
  });

  it('fullNameToInitials returns a set of initials', () => {
    expect(fullNameToInitials('Paige Turner')).toEqual('PT');
  });
});
