import { readInput } from '../utils.js';

interface Accumulator {
  all: string[][];
  current: string[];
}

async function run(args: string[]): Promise<void> {
  const content = await readInput('src/01/input.txt');
  const groups = content.reduce(
    (accumulator: Accumulator, currentValue: string) => {
      if (currentValue === '') {
        accumulator.all.push(accumulator.current);
        return {
          current: [],
          all: accumulator.all
        };
      } else {
        accumulator.current.push(currentValue);

        return accumulator;
      }
    },
    {
      current: [],
      all: []
    }
  );
  groups.all.push(groups.current);

  const sums = groups.all.map((value: string[]) => {
    return value.reduce((acc: number, current: string) => {
      return acc + Number.parseInt(current);
    }, 0);
  });
  const max = Math.max(...sums);
  console.log(`The maximum an elf carries is ${max}`);
}

export { run };
