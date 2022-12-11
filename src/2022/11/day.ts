import { chunkWithGap } from '../../utils.js';

interface Monkey {
  index: number;
  items: number[];
  worryOperation: WorryOperation;
  test: MonkeyTest;
  inspectedItems: number;
}

interface MonkeyTest {
  divisibleBy: number;
  targetIndexWhenTrue: number;
  targetIndexWhenFalse: number;
}

interface WorryOperation {
  calculateNew: (old: number) => number;
}

class SquaredWorryOperatuon implements WorryOperation {
  public calculateNew(old: number): number {
    return old * old;
  }
}

class AdditionWorryOperation implements WorryOperation {
  private scalar: number;

  constructor(scalar: number) {
    this.scalar = scalar;
  }

  public calculateNew(old: number): number {
    return old + this.scalar;
  }
}
class MultiplicationWorryOperation implements WorryOperation {
  private scalar: number;

  constructor(scalar: number) {
    this.scalar = scalar;
  }

  public calculateNew(old: number): number {
    return old * this.scalar;
  }
}

function run(content: string[]): void {
  const monkeys = parseContent(content);
  let monkeyBusiness = calculcateMonkeyBusines(monkeys, 20, true);
  console.log(
    `(Part 1): The level of monkey business after 20 rounds is '${monkeyBusiness}'`
  );
  monkeyBusiness = calculcateMonkeyBusines(monkeys, 10_000, false);
  console.log(
    `(Part 2): The level of monkey business after 10_000 rounds is '${monkeyBusiness}'`
  );
}

function parseContent(content: string[]): Monkey[] {
  return chunkWithGap(content, 6, 1).map((lines): Monkey => {
    return parseMonkey(lines);
  });
}

function parseMonkey(lines: string[]): Monkey {
  const index = Number.parseInt(lines[0].match(numberRegex)![0]);
  return {
    index,
    items: parseitems(lines[1]),
    worryOperation: parseOperation(lines[2]),
    test: parseMonkeyTest(lines.slice(3)),
    inspectedItems: 0
  };
}

function parseOperation(line: string): WorryOperation {
  let split = line.split(' = ');
  split = split[1].split(' ');
  if (split[1] === '*' && split[2] === 'old') {
    return new SquaredWorryOperatuon();
  } else if (split[1] === '+') {
    return new AdditionWorryOperation(Number.parseInt(split[2]));
  } else {
    return new MultiplicationWorryOperation(Number.parseInt(split[2]));
  }
}

const numberRegex = /\d+/;

function parseMonkeyTest(lines: string[]): MonkeyTest {
  const divisibleBy = Number.parseInt(lines[0].match(numberRegex)![0]);
  const targetIndexWhenTrue = Number.parseInt(lines[1].match(numberRegex)![0]);
  const targetIndexWhenFalse = Number.parseInt(lines[2].match(numberRegex)![0]);
  return {
    divisibleBy,
    targetIndexWhenTrue,
    targetIndexWhenFalse
  };
}

function parseitems(line: string): number[] {
  return line.split(': ')[1].split(', ').map(Number);
}

function calculcateMonkeyBusines(
  monkeys: Monkey[],
  rounds: number,
  part1: boolean
): number {
  // Stress level reducer
  const m = monkeys.reduce(
    (product, monkey) => product * monkey.test.divisibleBy,
    1
  );
  for (let round = 1; round <= rounds; round++) {
    runRound(monkeys, m, part1);
  }
  const inspectedItemsRanking = monkeys
    .map((monkey) => monkey.inspectedItems)
    .sort((a, b) => a - b);

  return inspectedItemsRanking.at(-1)! * inspectedItemsRanking.at(-2)!;
}

function runRound(monkeys: Monkey[], m: number, part1: boolean): void {
  for (let i = 0; i < monkeys.length; i++) {
    const monkey = monkeys[i];
    // console.log(`Monkey ${monkey.index}:`);

    inspectItems(monkey, monkeys, m, part1);
  }
}

function inspectItems(
  inspector: Monkey,
  monkeys: Monkey[],
  m: number,
  part1: boolean
): void {
  const items = inspector.items;
  while (items.length > 0) {
    let item = items.shift()!;
    inspector.inspectedItems += 1;
    // console.log(`  Monkey inspects an item with worry level of ${item}`);

    // Calculate new worry level
    item = inspector.worryOperation.calculateNew(item);
    // console.log(`    Worry level calculated by is now ${item}`);

    // Reduce stress by 3
    if (part1) {
      item = Math.floor(item / 3);
    }
    //
    else {
      item = item % m;
    }
    // console.log(
    //    `    Monkey gets bored. Worry Level is divided by 3 to ${item}`
    // );

    const itemTarget = calculcateTarget(inspector.test, item);
    // console.log(`    Monkey throws item to monkey ${itemTarget}`);

    monkeys[itemTarget].items.push(item);
  }
}

function calculcateTarget(
  targetTest: MonkeyTest,
  worryLevelOfItem: number
): number {
  const isDivisable = worryLevelOfItem % targetTest.divisibleBy === 0;
  // console.log(
  //   `    Current worry level is divisble by ${targetTest.divisibleBy}: ${isDivisable}`
  // );

  return isDivisable
    ? targetTest.targetIndexWhenTrue
    : targetTest.targetIndexWhenFalse;
}

export { run };
