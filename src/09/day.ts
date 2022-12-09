import { posix } from 'path';
import { Equatable, range, readInput, SetCustomEquals } from '../utils.js';

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

  const positionsTailVisitedOncePart1 = countPositionsTailVisitedOnce(
    commands,
    1
  );

  console.log(
    `(Part 1): The tail of rope length 1 visited '${positionsTailVisitedOncePart1}' positions at least once.`
  );
  const positionsTailVisitedOncePart2 = countPositionsTailVisitedOnce(
    commands,
    9
  );
  console.log(
    `(Part 2): The tail of rope length 9 visited '${positionsTailVisitedOncePart2}' positions at least once.`
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

function countPositionsTailVisitedOnce(
  commands: Command[],
  ropeLength: number
): number {
  const rope: Point[] = [new Point(0, 0)];
  // Add knots
  for (let i = 0; i < ropeLength; i++) {
    rope.push(new Point(0, 0));
  }

  const visitedPoints = new SetCustomEquals();
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    for (let move = 0; move < command.moves; move++) {
      rope[0] = moveHead(rope[0], command.direction);
      for (let ropeIndex = 1; ropeIndex < rope.length; ropeIndex++) {
        const prev = rope[ropeIndex - 1];
        const knot = rope[ropeIndex];
        rope[ropeIndex] = moveTail(prev, knot);
      }
      // console.log(
      //   'head:',
      //   `(${rope[0].x},${rope[0].y})`,
      //   'tail:',
      //   `(${rope.at(-1)!.x},${rope.at(-1)!.y})`
      // );

      visitedPoints.add(rope.at(-1)!);
    }
  }

  return visitedPoints.size;
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
