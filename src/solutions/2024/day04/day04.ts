export const countAppearances = (line: string, searchWord: string): number =>
  line
    .split("")
    .reduce(
      (acc, curr, idx) =>
        acc + (line.substring(idx).startsWith(searchWord) ? 1 : 0),
      0
    );

export const transpose = (input: string[]): string[] =>
  input[0]
    .split("")
    .map((_, i) => input.reduce((acc, curr) => acc + curr[i], ""));

export const makeDiagonalsTopLeft = (input: string[]): string[] => {
  const width = input[0].length;
  const height = input.length;

  const diagonals: string[] = [];
  for (let i = width - 1; i >= -height; i--) {
    const diagonal = input
      .map((line, y) =>
        line
          .split("")
          .map((char, x) => (x === y + i ? char : ""))
          .join("")
      )
      .join("");
    diagonal && diagonals.push(diagonal);
  }
  return diagonals;
};

export const solveStar1 = (input: string[]) => {
  const searchWord = "XMAS";

  const horizontals = [...input];
  const verticals = transpose(input);
  const diagonalsTL = makeDiagonalsTopLeft(input);
  const diagonalsBL = makeDiagonalsTopLeft(input.reverse());

  const allLinesForward = [
    ...horizontals,
    ...verticals,
    ...diagonalsTL,
    ...diagonalsBL,
  ];

  const allLinesReversed = allLinesForward.map((line) =>
    line.split("").reverse().join("")
  );

  const allLines = [...allLinesForward, ...allLinesReversed];

  return allLines.reduce(
    (acc, curr) => acc + countAppearances(curr, searchWord),
    0
  );
};

export const extract3x3 = (input: string[], x: number, y: number): string[] =>
  input.slice(y, y + 3).map((line) => line.substring(x, x + 3));

export const rotate90degClockwise = (input: string[]): string[] =>
  transpose(input).map((line) => line.split("").reverse().join(""));

export const rotateDeg = (
  input: string[],
  deg: 0 | 90 | 180 | 270
): string[] => {
  switch (deg) {
    case 0:
      return input;
    default:
      return rotateDeg(
        rotate90degClockwise(input),
        (deg - 90) as 0 | 90 | 180 | 270
      );
  }
};

export const isXMAS = (input: string[]): boolean => {
  return (
    input[1][1] === "A" &&
    input[0][0] === "M" &&
    input[2][0] === "M" &&
    input[0][2] === "S" &&
    input[2][2] === "S"
  );
};

const findXMAS = (input: string[]) => {
  const degrees = [0, 90, 180, 270] as const;
  return Array.from({ length: input.length - 2 }).reduce<number>(
    (countY, _, y) => {
      return (
        countY +
        Array.from({ length: input[0].length - 2 }).reduce<number>(
          (countX, _, x) => {
            const grid3x3 = extract3x3(input, x, y);
            if (degrees.some((deg) => isXMAS(rotateDeg(grid3x3, deg)))) {
              return countX + 1;
            }
            return countX;
          },
          0
        )
      );
    },
    0
  );
};

export const solveStar2 = (input: string[]) => {
  const normal = findXMAS(input);

  return normal;
};
