interface Dimensions {
  l: number;
  w: number;
  h: number;
}

function run(content: string[]): void {
  const dimensions = parseContent(content);
  const totalNeededWrappingPaper =
    calculateTotalNeededWrappingPaper(dimensions);
  console.log(
    `(Part 1): The total needed wrapping paper in square meters is '${totalNeededWrappingPaper}'.`
  );
  const totalNeededRibbon = calculateTotalNeededRibbon(dimensions);
  console.log(
    `(Part 2): The total needed ribbon in meters is '${totalNeededRibbon}'.`
  );
}

function calculateTotalNeededWrappingPaper(dimensions: Dimensions[]): number {
  return dimensions.reduce((sum, dimension): number => {
    return (sum += calculateNeededWrapperPaper(dimension));
  }, 0);
}

function calculateTotalNeededRibbon(dimensions: Dimensions[]): number {
  return dimensions.reduce((sum, dimension): number => {
    return (sum += calculateNeededRibbon(dimension));
  }, 0);
}

function parseContent(content: string[]): Dimensions[] {
  return content.map((line) => {
    const split = line.split('x').map(Number);
    return {
      l: split[0],
      w: split[1],
      h: split[2]
    };
  });
}

function calculateNeededWrapperPaper({ l, w, h }: Dimensions): number {
  const side1 = l * w;
  const side2 = w * h;
  const side3 = h * l;

  const smallestSide = Math.min(side1, side2, side3);

  return 2 * (side1 + side2 + side3) + smallestSide;
}

function calculateNeededRibbon({ l, w, h }: Dimensions): number {
  const volume = l * w * h;
  const sides = [l, w, h].sort((a, b) => a - b);

  return 2 * (sides[0] + sides[1]) + volume;
}

export { run };
