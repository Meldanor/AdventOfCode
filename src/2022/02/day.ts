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

enum MY_STRATEGY {
  LOSE = 'X',
  DRAW = 'Y',
  WIN = 'Z'
}

type ChoiceMap = {
  [key: string]: number;
};

const choiceValue: ChoiceMap = {
  [MY_CHOICE.ROCK]: 1,
  [MY_CHOICE.PAPER]: 2,
  [MY_CHOICE.SCISSORS]: 3
};

type OutcomeMap = {
  [key: string]: ChoiceMap;
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

type StrategyMap = {
  [key: string]: {
    [key: string]: string;
  };
};

const strategy: StrategyMap = {
  [OTHERS_CHOICE.ROCK]: {
    [MY_STRATEGY.LOSE]: MY_CHOICE.SCISSORS,
    [MY_STRATEGY.DRAW]: MY_CHOICE.ROCK,
    [MY_STRATEGY.WIN]: MY_CHOICE.PAPER
  },
  [OTHERS_CHOICE.PAPER]: {
    [MY_STRATEGY.LOSE]: MY_CHOICE.ROCK,
    [MY_STRATEGY.DRAW]: MY_CHOICE.PAPER,
    [MY_STRATEGY.WIN]: MY_CHOICE.SCISSORS
  },
  [OTHERS_CHOICE.SCISSORS]: {
    [MY_STRATEGY.LOSE]: MY_CHOICE.PAPER,
    [MY_STRATEGY.DRAW]: MY_CHOICE.SCISSORS,
    [MY_STRATEGY.WIN]: MY_CHOICE.ROCK
  }
};

function run(content: string[]): void {
  const totalScorePartOne = content.reduce(
    (acc: number, line: string): number => {
      return acc + calculatePartOneOutcome(line);
    },
    0
  );
  const totalScorePartTwo = content.reduce(
    (acc: number, line: string): number => {
      return acc + calculatePartTwoOutcome(line);
    },
    0
  );
  console.log(
    `(Part 1): Your total score with this strategy is ${totalScorePartOne}`
  );
  console.log(
    `(Part 2): Your total score with this strategy is ${totalScorePartTwo}`
  );
}

function calculatePartOneOutcome(line: string): number {
  const split = line.split(' ');
  const othersChoice = split[0];
  const myChoice = split[1];
  const outcome = choiceValue[myChoice] + outcomeValue[othersChoice][myChoice];

  // console.log(
  //   `${othersChoice} vs. ${myChoice} (${choiceValue[myChoice]} + ${outcomeValue[othersChoice][myChoice]}) => ${outcome}`
  // );
  return outcome;
}

function calculatePartTwoOutcome(line: string): number {
  const split = line.split(' ');
  const othersChoice = split[0];

  const myStrategy = split[1];
  const myChoice = strategy[othersChoice][myStrategy];
  const outcome = choiceValue[myChoice] + outcomeValue[othersChoice][myChoice];

  // console.log(
  //   `${othersChoice} vs. ${myChoice} (${choiceValue[myChoice]} + ${outcomeValue[othersChoice][myChoice]}) => ${outcome}`
  // );
  return outcome;
}

export { run };
