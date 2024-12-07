import { textReaderArr } from "../../../utils/textReader";
import {
  evaluate,
  findSolution,
  numberToBinaryArray,
  numberToTrinaryArray,
  Operator,
  solveStar1,
  solveStar2,
} from "./day07";
const DAY = parseInt(
  __filename.split("/").pop()!.split(".")[0].replace("day", "")
);
const YEAR = parseInt(
  __filename.split("/")[__filename.split("/").indexOf("solutions") + 1]
);

const testInput = textReaderArr(DAY, "test", YEAR);
const testInput2 = textReaderArr(DAY, "test2", YEAR);
const input = textReaderArr(DAY, "input", YEAR);

describe("Day " + DAY, () => {
  it("should evaluate", () => {
    expect(evaluate([81, 40, 27], [Operator.ADD, Operator.MUL])).toBe(3267);
    expect(evaluate([81, 40, 27], [Operator.MUL, Operator.ADD])).toBe(3267);
    expect(
      evaluate([6, 8, 6, 15], [Operator.MUL, Operator.CONC, Operator.MUL])
    ).toBe(7290);
  });

  it("should be binary", () => {
    expect(numberToBinaryArray(0, 3)).toEqual([0, 0, 0]);
    expect(numberToBinaryArray(1, 3)).toEqual([1, 0, 0]);
    expect(numberToBinaryArray(2, 3)).toEqual([0, 1, 0]);
    expect(numberToBinaryArray(3, 3)).toEqual([1, 1, 0]);
  });

  it("should be trinary", () => {
    expect(numberToTrinaryArray(0, 3)).toEqual([0, 0, 0]);
    expect(numberToTrinaryArray(1, 3)).toEqual([1, 0, 0]);
    expect(numberToTrinaryArray(2, 3)).toEqual([2, 0, 0]);
    expect(numberToTrinaryArray(7, 3)).toEqual([1, 2, 0]);
    expect(numberToTrinaryArray(11, 3)).toEqual([2, 0, 1]);
  });

  it("should pass test", () => {
    expect(solveStar1(testInput)).toBe(3749);
  });

  it("should solve star 1", () => {
    expect(solveStar1(input)).toBe(1430271835320);
  });

  it("should pass test for star 2", () => {
    expect(solveStar2(testInput)).toBe(11387);
  });

  it("should solve star 2", () => {
    expect(solveStar2(input)).toBe(456565678667482);
  });
});
