import { posix } from 'path';
import { Equatable, readInput, SetCustomEquals } from '../utils.js';

interface Direction {
  xD: number;
  yD: number;
}

type DirectionsMap = {
  [key: string]: Direction;
};

const directions: DirectionsMap = {
  R: { xD: 1, yD: 0 },
  D: { xD: 0, yD: 1 },
  L: { xD: -1, yD: 0 },
  U: { xD: 0, yD: -1 }
};

interface Command {
  direction: Direction;
  moves: number;
}

class Point implements Equatable {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(object: Point): boolean {
    return this.x === object.x && this.y === object.y;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(args: string[]): Promise<void> {
  const content = await readInput('src/09/input.txt');
  const commands = parseContent(content);

  const positionsTailVisitedOnce = countPositionsTailVisitedOnce(commands);

  console.log(
    `(Part 1): The tail visited '${positionsTailVisitedOnce}' positions at least once.`
  );
}

function parseContent(content: string[]): Command[] {
  return content.map((line): Command => {
    const split = line.split(' ');
    return {
      direction: directions[split[0]],
      moves: Number.parseInt(split[1])
    };
  });
}

function countPositionsTailVisitedOnce(commands: Command[]): number {
  let curHeadPos = new Point(0, 0);
  let curTailPos = new Point(0, 0);
  const visitedPoints: Point[] = [curTailPos];
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    for (let move = 0; move < command.moves; move++) {
      curHeadPos = moveHead(curHeadPos, command.direction);
      curTailPos = moveTail(curHeadPos, curTailPos);
      // console.log(
      //   'head:',
      //   `(${curHeadPos.x},${curHeadPos.y})`,
      //   'tail:',
      //   `(${curTailPos.x},${curTailPos.y})`
      // );
      visitedPoints.push(curTailPos);
    }
  }

  const uniquePoints = new SetCustomEquals(visitedPoints);
  return uniquePoints.size;
}

function moveHead(curHeadPos: Point, direction: Direction): Point {
  return new Point(curHeadPos.x + direction.xD, curHeadPos.y + direction.yD);
}

function moveTail(curHeadPos: Point, curTailPos: Point): Point {
  const xDiff = curHeadPos.x - curTailPos.x;
  const yDiff = curHeadPos.y - curTailPos.y;
  // Only move when the distance is at least 2 in any direction
  if (Math.abs(xDiff) < 2 && Math.abs(yDiff) < 2) {
    return curTailPos;
  }
  const dirX = Math.sign(xDiff);
  const dirY = Math.sign(yDiff);
  return new Point(curTailPos.x + dirX, curTailPos.y + dirY);
}

export { run };
