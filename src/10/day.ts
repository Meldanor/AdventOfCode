import { readInput } from '../utils.js';

enum OperationType {
  ADDX = 'addx',
  NOOP = 'noop'
}

interface Operation {
  cycles: number;
  type: OperationType;
}

type OperationsMap = {
  [key: string]: Operation;
};

const operations: OperationsMap = {
  addx: { cycles: 2, type: OperationType.ADDX },
  noop: { cycles: 1, type: OperationType.NOOP }
};

interface Command {
  operation: Operation;
  argument?: number;
}

interface Cpu {
  registerX: number;
  currentCycle: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(args: string[]): Promise<void> {
  const content = await readInput('src/10/input.txt');
  const commands = parseContent(content);
  console.log(`(Part 2): The CRT displays this: `);

  const sumOfSignals = executeCommands(
    commands,
    new Set([20, 60, 100, 140, 180, 220])
  );
  console.log();
  console.log();

  console.log(`(Part 1): The sum of the six signals is ${sumOfSignals}`);
}

function parseContent(content: string[]): Command[] {
  return content.map((line): Command => {
    const split = line.split(' ');
    const operation = operations[split[0]];

    return {
      operation,
      argument: split.length === 2 ? Number.parseInt(split[1]) : undefined
    };
  });
}

function executeCommands(
  commands: Command[],
  cyclesToSumSignal: Set<number>
): number {
  let cpu: Cpu = { currentCycle: 0, registerX: 1 };
  let sum = 0;
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];

    for (let cycle = 1; cycle <= command.operation.cycles; cycle++) {
      printToCrt(cpu);
      cpu.currentCycle += 1;
      if (cyclesToSumSignal.has(cpu.currentCycle)) {
        sum += cpu.currentCycle * cpu.registerX;
      }
      cpu = executeCommand(command, cpu, cycle);
    }
  }

  return sum;
}

function executeCommand(command: Command, cpu: Cpu, curCycle: number): Cpu {
  if (command.operation === operations['noop']) {
    return cpu;
  } else if (command.operation === operations['addx']) {
    if (curCycle === 2) {
      return {
        currentCycle: cpu.currentCycle,
        registerX: (cpu.registerX += command.argument!)
      };
    } else {
      return cpu;
    }
  } else {
    throw new Error(`Unsupported command '${command}'`);
  }
}

function printToCrt(cpu: Cpu): void {
  const crtHorizontalPosition = cpu.currentCycle % 40;
  if (crtHorizontalPosition === 0) {
    process.stdout.write('\n');
  }
  const spriteMiddle = cpu.registerX;
  if (
    crtHorizontalPosition === spriteMiddle ||
    crtHorizontalPosition - 1 === spriteMiddle ||
    crtHorizontalPosition + 1 === spriteMiddle
  ) {
    process.stdout.write('#');
  } else {
    process.stdout.write('.');
  }
}

export { run };
