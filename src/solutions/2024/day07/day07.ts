interface Equation {
  res: number;
  numbers: number[];
}

export enum Operator {
  ADD,
  MUL,
  CONC,
}

const parseInput = (input: string): Equation => {
  const [left, right] = input.split(":");
  return {
    res: Number(left.trim()),
    numbers: right.trim().split(" ").map(Number),
  };
};

export const evaluate = (numbers: number[], operators: Operator[]) => {
  return operators.reduce((acc, curr, index) => {
    switch (curr) {
      case Operator.ADD:
        return acc + numbers[index + 1];
      case Operator.MUL:
        return acc * numbers[index + 1];
      case Operator.CONC:
        return Number(acc.toString() + numbers[index + 1].toString());
    }
  }, numbers[0]);
};

export const numberToBinaryArray = (
  num: number,
  arrayLength: number
): number[] => {
  const arr = [];
  for (let i = 0; i < arrayLength; i++) {
    arr.push(num % 2);
    num = Math.floor(num / 2);
  }
  return arr;
};

export const numberToTrinaryArray = (
  num: number,
  arrayLength: number
): number[] => {
  const arr = [];
  for (let i = 0; i < arrayLength; i++) {
    arr.push(num % 3);
    num = Math.floor(num / 3);
  }
  return arr;
};

export const findSolution = (equation: Equation): boolean => {
  return Array.from({ length: 2 ** (equation.numbers.length - 1) }).some(
    (_, i) => {
      const operators = numberToBinaryArray(
        i,
        equation.numbers.length - 1
      ) as Operator[];
      return evaluate(equation.numbers, operators) === equation.res;
    }
  );
};

export const solveStar1 = (input: string[]) => {
  return input
    .map(parseInput)
    .filter(findSolution)
    .map((eq) => eq.res)
    .reduce((acc, curr) => acc + curr, 0);
};

export const findSolution2 = (equation: Equation): boolean => {
  return Array.from({ length: 3 ** (equation.numbers.length - 1) }).some(
    (_, i) => {
      const operators = numberToTrinaryArray(
        i,
        equation.numbers.length - 1
      ) as Operator[];
      return evaluate(equation.numbers, operators) === equation.res;
    }
  );
};

export const solveStar2 = (input: string[]) => {
  return input
    .map(parseInput)
    .filter(findSolution2)
    .map((eq) => eq.res)
    .reduce((acc, curr) => acc + curr, 0);
};
