// Button A: X+94, Y+34
// Button B: X+22, Y+67
// Prize: X=8400, Y=5400

import { splitInChunks } from "../../../utils/helpers";

interface ClawMachineConfig {
  a: {
    x: number;
    y: number;
  };
  b: {
    x: number;
    y: number;
  };
  prize: {
    x: number;
    y: number;
  };
}

const parseSection = ([
  buttonA,
  buttonB,
  prize,
]: string[]): ClawMachineConfig => {
  const [, , aX, aY] = buttonA
    .split(" ")
    .map((p) => p.replace(",", "").split("+")[1]);
  const [, , bX, bY] = buttonB
    .split(" ")
    .map((p) => p.replace(",", "").split("+")[1]);
  const [, pX, pY] = prize
    .split(" ")
    .map((p) => p.replace(",", "").split("=")[1]);

  return {
    a: {
      x: Number(aX),
      y: Number(aY),
    },
    b: {
      x: Number(bX),
      y: Number(bY),
    },
    prize: {
      x: Number(pX),
      y: Number(pY),
    },
  };
};

const solve = (config: ClawMachineConfig): { a: number; b: number } => {
  const {
    a: { x: xa, y: ya },
    b: { x: xb, y: yb },
    prize: { x: xp, y: yp },
  } = config;

  const a = -(yp * xb - yb * xp) / (xa * yb - xb * ya);
  const b = -(xp * ya - xa * yp) / (xa * yb - xb * ya);

  return { a, b };
};

const isInteger = (n: number) => n % 1 === 0;

export const solveStar1 = (input: string[]) => {
  const sections = splitInChunks(input, 4).map(parseSection);
  const answers = sections
    .map(solve)
    .filter(({ a, b }) => isInteger(a) && isInteger(b));

  const costs = answers.map(({ a, b }) => 3 * a + b);

  const totalCost = costs.reduce((a, b) => a + b);

  return totalCost;
};

export const solveStar2 = (input: string[]) => {
  const sections = splitInChunks(input, 4)
    .map(parseSection)
    .map((s) => ({
      ...s,
      prize: {
        ...s.prize,
        x: s.prize.x + 10000000000000,
        y: s.prize.y + 10000000000000,
      },
    }));

  const answers = sections
    .map(solve)
    .filter(({ a, b }) => isInteger(a) && isInteger(b));

  const costs = answers.map(({ a, b }) => 3 * a + b);

  const totalCost = costs.reduce((a, b) => a + b, 0);

  return totalCost;
};
