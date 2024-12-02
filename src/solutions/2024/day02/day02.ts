const diffs = (levels: number[]): number[] =>
  levels.slice(1).map((l, i) => l - levels[i]);

const isAllMost = (values: number[], max: number): boolean =>
  values.every((val) => val <= max);

const isAllLeast = (values: number[], min: number): boolean =>
  values.every((val) => val >= min);

const isSafe = (report: number[]): boolean => {
  const d = diffs(report);

  const isIncreasingOrDecreasing = isAllLeast(d, 1) || isAllMost(d, -1);

  if (!isIncreasingOrDecreasing) {
    return false;
  }

  const absDiffs = d.map(Math.abs);

  return isAllMost(absDiffs, 3) && isAllLeast(absDiffs, 1);
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
