import { readInput } from '../utils.js';

type PriorityMap = {
  [key: string]: number;
};

const priorityValues = range(52)
  .map((val: number): string => {
    if (val < 26) {
      return String.fromCharCode('a'.charCodeAt(0) + val);
    } else {
      return String.fromCharCode('A'.charCodeAt(0) + (val - 26));
    }
  })
  .reduce((acc: PriorityMap, cur: string, index: number): PriorityMap => {
    acc[cur] = index + 1;
    return acc;
  }, {});

function range(size: number, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(args: string[]): Promise<void> {
  const content = await readInput('src/03/input.txt');
  const sumOfPriorities = content.reduce(
    (acc: number, line: string): number => {
      return acc + priorityOfSameItem(line);
    },
    0
  );
  console.log(`(Part 1): The sum of the priorities are ${sumOfPriorities}`);
}

function priorityOfSameItem(rucksack: string): number {
  const firstCompartment = rucksack.slice(0, rucksack.length / 2);
  const secondCompartment = rucksack.slice(rucksack.length / 2);
  const sameItem = findSameItem(firstCompartment, secondCompartment);
  if (sameItem === '') {
    throw new Error('No same item found in ' + rucksack);
  } else {
    // console.log(
    //   `The same item for the rucksack ${firstCompartment} : ${secondCompartment} is '${sameItem}'`
    // );
  }
  return priorityValues[sameItem];
}

function findSameItem(
  firstCompartment: string,
  secondCompartment: string
): string {
  for (let i = 0; i < firstCompartment.length; i++) {
    const element = firstCompartment[i];
    if (secondCompartment.includes(element)) {
      return element;
    }
  }
  return '';
}

export { run };
