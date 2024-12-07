interface Equation {
  res: number;
  numbers: number[];
}

export enum Operator {
  ADD = "0",
  MUL = "1",
  CONC = "2",
}

const parseInput = (input: string): Equation => {
  const [left, right] = input.split(":");
  return {
    res: Number(left.trim()),
    numbers: right.trim().split(" ").map(Number),
  };
};

export const evaluate = (numbers: number[], operators: string[]) => {
  return operators.reduce((acc, curr, index) => {
    switch (curr as Operator) {
      case Operator.ADD:
        return acc + numbers[index + 1];
      case Operator.MUL:
        return acc * numbers[index + 1];
      case Operator.CONC:
        return Number(acc.toString() + numbers[index + 1].toString());
    }
  }, numbers[0]);
};

export const numberToArray = (
  num: number,
  arrayLength: number,
  radix = 2
): string[] => num.toString(radix).padStart(arrayLength, "0").split("");

export const findSolution = (equation: Equation, ops = 2): boolean => {
  return Array.from({ length: ops ** (equation.numbers.length - 1) }).some(
    (_, i) => {
      const operators = numberToArray(i, equation.numbers.length - 1, ops);
      return evaluate(equation.numbers, operators) === equation.res;
    }
  );
};

export const solveStar1 = (input: string[]) => {
  return input
    .map(parseInput)
    .filter((eq) => findSolution(eq, 2))
    .map((eq) => eq.res)
    .reduce((acc, curr) => acc + curr, 0);
};

export const solveStar2 = (input: string[]) => {
  return input
    .map(parseInput)
    .filter((eq) => findSolution(eq, 3))
    .map((eq) => eq.res)
    .reduce((acc, curr) => acc + curr, 0);
};
