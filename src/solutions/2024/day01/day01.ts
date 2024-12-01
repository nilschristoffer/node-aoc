const arraysFromInput = (input: string[]) => {
  const leftArray: number[] = [];
  const rightArray: number[] = [];
  for (const line of input) {
    const [left, right] = line.split(" ").filter(Boolean).map(Number);
    leftArray.push(left);
    rightArray.push(right);
  }
  return { leftArray, rightArray };
};

export const solveStar1 = (input: string[]) => {
  const { leftArray, rightArray } = arraysFromInput(input);
  leftArray.sort((a, b) => a - b);
  rightArray.sort((a, b) => a - b);

  return leftArray.reduce(
    (acc, curr, index) => acc + Math.abs(curr - rightArray[index]),
    0
  );
};

export const solveStar2 = (input: string[]) => {
  const { leftArray, rightArray } = arraysFromInput(input);

  const rightArrayCountRecord = rightArray.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: (acc[curr] || 0) + 1,
    }),
    {} as { [key: number]: number }
  );

  return leftArray.reduce(
    (acc, curr) => acc + curr * (rightArrayCountRecord[curr] || 0),
    0
  );
};
