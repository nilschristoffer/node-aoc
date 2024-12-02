const diffs = (levels: number[]): number[] => {
  const diffs = [];
  for (let i = 1; i < levels.length; i++) {
    diffs.push(levels[i] - levels[i - 1]);
  }
  return diffs;
};

const isAllPositive = (diffs: number[]): boolean => {
  return diffs.every((diff) => diff >= 0);
};

const isAllNegative = (diffs: number[]): boolean => {
  return diffs.every((diff) => diff <= 0);
};

const isAllLeast = (diffs: number[], val: number): boolean => {
  return diffs.every((diff) => Math.abs(diff) <= val);
};

const isAllMost = (diffs: number[], val: number): boolean => {
  return diffs.every((diff) => Math.abs(diff) >= val);
};

const isSafe = (report: number[]): boolean => {
  const d = diffs(report);
  return (
    (isAllPositive(d) || isAllNegative(d)) &&
    isAllLeast(d, 3) &&
    isAllMost(d, 1)
  );
};

export const solveStar1 = (input: string[]) => {
  const reports = input.map((line) => line.split(" ").map(Number));
  return reports.filter(isSafe).length;
};

const variants = (report: number[]): number[][] => {
  const variants = [report];
  for (let i = 0; i < report.length; i++) {
    variants.push(
      report.slice(0, i).concat(report.slice(i + 1, report.length))
    );
  }
  return variants;
};

export const solveStar2 = (input: string[]) => {
  const reports = input.map((line) => line.split(" ").map(Number));

  return reports
    .map(variants)
    .filter((reportVariants) => reportVariants.some(isSafe)).length;
};
