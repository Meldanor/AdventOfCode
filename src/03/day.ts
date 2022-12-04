import { readInput, chunk, range } from '../utils.js';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(args: string[]): Promise<void> {
  const content = await readInput('src/03/input.txt');
  // Part 1
  const sumOfPriorities = content.reduce(
    (acc: number, line: string): number => {
      return acc + priorityOfSameItemInRucksack(line);
    },
    0
  );
  console.log(`(Part 1): The sum of the priorities is ${sumOfPriorities}`);

  // Part 2
  const groups = chunk(content, 3);
  const sumOfBadgePriorities = groups.reduce(
    (acc: number, line: string[]): number => {
      return acc + priorityOfSameItemInGroup(line);
    },
    0
  );
  console.log(
    `(Part 2): The sum of the priorities of each group is ${sumOfBadgePriorities}`
  );
}

function priorityOfSameItemInRucksack(rucksack: string): number {
  const firstCompartment = rucksack.slice(0, rucksack.length / 2);
  const secondCompartment = rucksack.slice(rucksack.length / 2);
  const sameItem = findSameItemInRucksack(firstCompartment, secondCompartment);
  if (sameItem === '') {
    throw new Error('No same item found in ' + rucksack);
  } else {
    // console.log(
    //   `The same item for the rucksack ${firstCompartment} : ${secondCompartment} is '${sameItem}'`
    // );
  }
  return priorityValues[sameItem];
}

function priorityOfSameItemInGroup(group: string[]): number {
  const sameItem = findSameIteminGroup(group[0], group[1], group[2]);
  if (sameItem === '') {
    throw new Error('No same item found in ' + group);
  } else {
    // console.log(
    //   `The same item for the rucksack ${firstCompartment} : ${secondCompartment} is '${sameItem}'`
    // );
  }
  return priorityValues[sameItem];
}

function findSameItemInRucksack(
  firstCompartment: string,
  secondCompartment: string
): string {
  for (let i = 0; i < firstCompartment.length; i++) {
    const item = firstCompartment[i];
    if (secondCompartment.includes(item)) {
      return item;
    }
  }
  return '';
}

function findSameIteminGroup(
  firstRucksack: string,
  secondRucksack: string,
  thirdRucksack: string
): string {
  for (let i = 0; i < firstRucksack.length; i++) {
    const item = firstRucksack[i];
    if (secondRucksack.includes(item) && thirdRucksack.includes(item)) {
      return item;
    }
  }
  return '';
}

export { run };
