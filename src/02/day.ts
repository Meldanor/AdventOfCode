import { readInput } from '../utils.js';

enum OTHERS_CHOICE {
  ROCK = 'A',
  PAPER = 'B',
  SCISSORS = 'C'
}

enum MY_CHOICE {
  ROCK = 'X',
  PAPER = 'Y',
  SCISSORS = 'Z'
}

type OthersChoiceMap = {
  [key: string]: number;
};

const choiceValue: OthersChoiceMap = {
  [MY_CHOICE.ROCK]: 1,
  [MY_CHOICE.PAPER]: 2,
  [MY_CHOICE.SCISSORS]: 3
};

type OutcomeMap = {
  [key: string]: OthersChoiceMap;
};

const outcomeValue: OutcomeMap = {
  [OTHERS_CHOICE.ROCK]: {
    [MY_CHOICE.ROCK]: 3,
    [MY_CHOICE.PAPER]: 6,
    [MY_CHOICE.SCISSORS]: 0
  },
  [OTHERS_CHOICE.PAPER]: {
    [MY_CHOICE.ROCK]: 0,
    [MY_CHOICE.PAPER]: 3,
    [MY_CHOICE.SCISSORS]: 6
  },
  [OTHERS_CHOICE.SCISSORS]: {
    [MY_CHOICE.ROCK]: 6,
    [MY_CHOICE.PAPER]: 0,
    [MY_CHOICE.SCISSORS]: 3
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(args: string[]): Promise<void> {
  const content = await readInput('src/02/input.txt');
  const totalScore = content.reduce((acc: number, line: string): number => {
    return acc + calculateOutcome(line);
  }, 0);
  console.log(`Your total score with this strategy is ${totalScore}`);
}

function calculateOutcome(line: string): number {
  const split = line.split(' ');
  const othersChoice = split[0];
  const myChoice = split[1];
  const outcome = choiceValue[myChoice] + outcomeValue[othersChoice][myChoice];

  // console.log(
  //   `${othersChoice} vs. ${myChoice} (${choiceValue[myChoice]} + ${outcomeValue[othersChoice][myChoice]}) => ${outcome}`
  // );
  return outcome;
}

export { run };
