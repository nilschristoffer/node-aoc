import { textReaderArr } from "../../../utils/textReader";
import {
  getAllSequences,
  mix,
  processSecret,
  prune,
  solveStar1,
  solveStar2,
} from "./day22";
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
  it("should mix", () => {
    expect(mix(42, 15)).toBe(37);
    expect(mix(15, 42)).toBe(37);
  });

  it("should prune", () => {
    expect(prune(100000000)).toBe(16113920);
  });

  it("should process", () => {
    expect(processSecret(123)).toBe(15887950);
  });

  it("should pass test", () => {
    expect(solveStar1(testInput)).toBe(37327623);
  });

  it("should solve star 1", () => {
    // expect(solveStar1(input)).toBe(21147129593);
  });

  it("should pass test 2 for star 2", () => {
    expect(solveStar2(testInput2)).toBe(23);
  });

  it("should solve star 2", () => {
    // expect(solveStar2(input)).toBe(2445);
  });
});
