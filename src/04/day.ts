import { range, readInput } from '../utils.js';

interface Range {
  start: number;
  end: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(args: string[]): Promise<void> {
  const content = await readInput('src/04/input.txt');
  // Part 1
  const redundantAssignments = content.reduce(
    (acc: number, line: string): number => {
      if (hasFullyContainedAssignment(line)) {
        return acc + 1;
      } else {
        return acc;
      }
    },
    0
  );
  console.log(
    `(Part 1): There are '${redundantAssignments}' redudandant assignments`
  );
  // Part 2
  const overlappingAssignments = content.reduce(
    (acc: number, line: string): number => {
      if (hasOverlappingAssignment(line)) {
        return acc + 1;
      } else {
        return acc;
      }
    },
    0
  );
  console.log(
    `(Part 2): There are '${overlappingAssignments}' pairs that overlaps.`
  );
}

function hasFullyContainedAssignment(line: string): boolean {
  const pairs = line.split(',');
  const firstRange = parseRange(pairs[0]);
  const secondRange = parseRange(pairs[1]);

  return (
    isRangeIncludedIn(firstRange, secondRange) ||
    isRangeIncludedIn(secondRange, firstRange)
  );
}

function parseRange(pair: string): Range {
  const split = pair.split('-');
  return {
    start: Number.parseInt(split[0]),
    end: Number.parseInt(split[1])
  };
}

function isRangeIncludedIn(thisRange: Range, otherRange: Range) {
  return thisRange.start >= otherRange.start && thisRange.end <= otherRange.end;
}

function hasOverlappingAssignment(line: string): boolean {
  const pairs = line.split(',');
  const firstRange = parseRange(pairs[0]);
  const secondRange = parseRange(pairs[1]);

  const firstRangeSet = rangeToSet(firstRange);
  const secondRangeSet = rangeToSet(secondRange);

  return (
    isRangeSetOverlapping(firstRangeSet, secondRangeSet) ||
    isRangeSetOverlapping(secondRangeSet, firstRangeSet)
  );
}

function rangeToSet(givenRange: Range): Set<number> {
  return new Set(
    range(givenRange.end - givenRange.start + 1, givenRange.start)
  );
}

function isRangeSetOverlapping(
  thisRange: Set<number>,
  otherRange: Set<number>
) {
  for (
    let iterator = thisRange.values(), val = null;
    (val = iterator.next().value);

  ) {
    if (otherRange.has(val)) {
      return true;
    }
  }

  return false;
}

export { run };
