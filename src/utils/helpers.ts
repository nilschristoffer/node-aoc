export const sum: (previousValue: number, currentValue: number) => number = (
  acc,
  val
) => acc + val;

export const sortSmallestToBiggest = (a: number, b: number) => a - b;
export const sortBiggestToSmallest = (a: number, b: number) => b - a;

export const sortSmallestFirst =
  <T>(key: keyof T) =>
  (a: T, b: T) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  };

export const sortBiggestFirst =
  <T>(key: keyof T) =>
  (a: T, b: T) => {
    if (a[key] < b[key]) {
      return 1;
    }
    if (a[key] > b[key]) {
      return -1;
    }
    return 0;
  };

export const times = (fn: (index: number) => void, n: number) => {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
};

export const parseIntAfter = (line: string, after: string): number =>
  parseInt(line.split(after)[1]);

export const functionTimer = (fn: () => void) => {
  const start = Date.now();
  fn();
  const end = Date.now();
  console.log(`Took ${end - start}ms`);
};

export const splitInChunks = (
  input: string[],
  chunkSize: number
): string[][] => {
  const chunks = [];
  for (let i = 0; i < input.length; i += chunkSize) {
    chunks.push(input.slice(i, i + chunkSize));
  }
  return chunks;
};

export const last = <T>(arr: T[]) => arr[arr.length - 1];
export const first = <T>(arr: T[]) => arr[0];
