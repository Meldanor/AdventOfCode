function run(content: string[]): void {
  const part1Floor = findFloor(content[0]);
  console.log(`(Part 1): Santa must go to the floor '${part1Floor}'.`);
  const part2FloorIndex = findFirstBasementCharIndex(content[0]);
  console.log(
    `(Part 2): The index of the char for the basemane is '${part2FloorIndex}'.`
  );
}

function findFloor(instructions: string): number {
  return [...instructions].reduce((sum, char): number => {
    return sum + (char === '(' ? 1 : -1);
  }, 0);
}

function findFirstBasementCharIndex(instructions: string): number {
  let sum = 0;
  for (let i = 0; i < instructions.length; i++) {
    const char = instructions[i];
    sum += char === '(' ? 1 : -1;
    if (sum === -1) {
      return i + 1;
    }
  }
  return -1;
}

export { run };
