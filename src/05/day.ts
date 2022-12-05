import { readInput } from '../utils.js';

interface Input {
  stacks: string[][];
  commands: Command[];
}

interface Command {
  amount: number;
  from: number;
  to: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(args: string[]): Promise<void> {
  const content = await readInput('src/05/input.txt');
  const input = parseInput(content);
  const finishedStacks = executeInput(input);
  const message = parseMessage(finishedStacks);
  // console.log(input);
  // console.log(finishedStacks);

  console.log(`(Part 1): The top crates are '${message}'.`);
}

function parseInput(content: string[]): Input {
  const separator = content.findIndex((val) => val === '');
  return {
    stacks: parseStacks(content.slice(0, separator - 1)),
    commands: parseCommands(content.slice(separator + 1))
  };
}

function parseStacks(stacksRaw: string[]): string[][] {
  const transposeStacks = stacksRaw.map((line) => {
    const chunk: string[] = [];
    for (let i = 0; i < line.length; i += 4) {
      const e = line.slice(i, i + 3);
      chunk.push(e);
    }
    return chunk;
  });
  // console.log(transposeStacks);

  const width = transposeStacks[0].length;
  const height = transposeStacks.length;

  const stacks: string[][] = [];
  for (let w = 0; w < width; w++) {
    const stack: string[] = [];
    stacks[w] = stack;

    for (let h = 0; h < height; h++) {
      const element = transposeStacks[h][w];
      if (element !== '   ') {
        stack.push(element);
      }
    }
  }

  return stacks;
}

function parseCommands(lines: string[]): Command[] {
  return lines.map((line): Command => {
    const regexp = /\d+/g;

    const array = [...line.matchAll(regexp)].map(Number);
    return {
      amount: array[0],
      from: array[1],
      to: array[2]
    };
  });
}

function executeInput(input: Input): string[][] {
  const stacks = structuredClone(input.stacks);
  for (let i = 0; i < input.commands.length; i++) {
    const command = input.commands[i];
    const from = stacks[command.from - 1];
    const to = stacks[command.to - 1];
    for (let move = 0; move < command.amount; move++) {
      const crate = from.shift() as string;
      to.unshift(crate);
    }
  }
  return stacks;
}

function parseMessage(finishedStacks: string[][]): string {
  return finishedStacks
    .map((stack): string => stack[0])
    .join('')
    .replaceAll('[', '')
    .replaceAll(']', '');
}

export { run };
