import { readInput } from '../utils.js';

interface Matrix {
  values: number[];
  width: number;
  height: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(args: string[]): Promise<void> {
  const content = await readInput('src/08/input.txt');
  const matrix = parseContent(content);
  console.log(matrix);
  const visibleTrees = countVisibleTreeFromOutsideGrid(matrix);

  console.log(
    `(Part 1): There are '${visibleTrees}' trees visible from outside the grid`
  );

  const bestScenicScore = findBestScenicScore(matrix);
  console.log(`(Part 2): The highest scenic score is '${bestScenicScore}'`);
}

function parseContent(lines: string[]): Matrix {
  const values = lines.flatMap((line) => line.split('').map(Number));
  return {
    values,
    width: lines[0].length,
    height: lines.length
  };
}

function getPoint(x: number, y: number, matrix: Matrix): number | undefined {
  if (x < 0 || x >= matrix.width || y < 0 || y >= matrix.height) {
    return undefined;
  } else {
    return matrix.values[x + y * matrix.height];
  }
}

function countVisibleTreeFromOutsideGrid(matrix: Matrix): number {
  let count = 0;
  for (let x = 1; x < matrix.width - 1; x++) {
    for (let y = 1; y < matrix.height - 1; y++) {
      const tree = getPoint(x, y, matrix) as number;
      count += isTreeVisibleFromOutsideGrid(tree, x, y, matrix) ? 1 : 0;
    }
  }
  // Add the perimenter (2*a + 2*b - 4 (corner trees))
  count += matrix.width * 2 + matrix.height * 2 - 4;
  return count;
}

function isTreeVisibleFromOutsideGrid(
  tree: number,
  x: number,
  y: number,
  matrix: Matrix
): boolean {
  let hasBigger = true;
  // Check left
  for (let x1 = 0; x1 < x; x1++) {
    hasBigger = getPoint(x1, y, matrix)! >= tree;
    if (hasBigger) {
      break;
    }
  }
  if (!hasBigger) return true;

  // Check right
  for (let x1 = x + 1; x1 < matrix.width; x1++) {
    hasBigger = getPoint(x1, y, matrix)! >= tree;
    if (hasBigger) {
      break;
    }
  }
  if (!hasBigger) return true;

  // Check Top
  for (let y1 = 0; y1 < y; y1++) {
    hasBigger = getPoint(x, y1, matrix)! >= tree;
    if (hasBigger) {
      break;
    }
  }
  if (!hasBigger) return true;

  // Check Bottom
  for (let y1 = y + 1; y1 < matrix.height; y1++) {
    hasBigger = getPoint(x, y1, matrix)! >= tree;
    if (hasBigger) {
      break;
    }
  }
  if (!hasBigger) return true;

  return false;
}

function findBestScenicScore(matrix: Matrix): number {
  let bestScenicScore = Number.MIN_VALUE;
  for (let x = 0; x < matrix.width; x++) {
    for (let y = 0; y < matrix.height; y++) {
      const curScenicScore = calculateScenicScore(x, y, matrix);
      if (curScenicScore > bestScenicScore) {
        bestScenicScore = curScenicScore;
      }
    }
  }
  return bestScenicScore;
}

function calculateScenicScore(x: number, y: number, matrix: Matrix): number {
  const tree = getPoint(x, y, matrix)!;
  let countLeft = 0;
  // Check left
  for (let x1 = x - 1; x1 >= 0; x1--) {
    countLeft += 1;
    if (getPoint(x1, y, matrix)! >= tree) {
      break;
    }
  }

  let countRight = 0;
  // Check Right
  for (let x1 = x + 1; x1 < matrix.width; x1++) {
    countRight += 1;
    if (getPoint(x1, y, matrix)! >= tree) {
      break;
    }
  }

  let countTop = 0;
  for (let y1 = y - 1; y1 >= 0; y1--) {
    countTop += 1;
    if (getPoint(x, y1, matrix)! >= tree) {
      break;
    }
  }

  let countBottom = 0;
  for (let y1 = y + 1; y1 < matrix.height; y1++) {
    countBottom += 1;
    if (getPoint(x, y1, matrix)! >= tree) {
      break;
    }
  }

  return countLeft * countRight * countTop * countBottom;
}

export { run };
