import { readInput } from '../utils.js';

interface Range {
  start: number;
  end: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(args: string[]): Promise<void> {
  const content = await readInput('src/04/input.txt');
  const overlappingAssignments = content.reduce(
    (acc: number, line: string): number => {
      if (isOverlappingAssignment(line)) {
        return acc + 1;
      } else {
        return acc;
      }
    },
    0
  );
  console.log(
    `(Part 1): There are '${overlappingAssignments}' overlaping assignments`
  );
}

function isOverlappingAssignment(line: string): boolean {
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
  // thisRange.start: 3
  // thisRange.end: 7
  // otherRange.start: 2
  // otherRange.end: 8
  return thisRange.start >= otherRange.start && thisRange.end <= otherRange.end;
}

export { run };
