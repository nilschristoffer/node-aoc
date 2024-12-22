import exp from "constants";
import { textReaderArr } from "../../../utils/textReader";
import { solveStar1, solveStar2 } from "./day12";
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
  it("should pass test", () => {
    expect(solveStar1(testInput)).toBe(1930);
  });

  it("should solve star 1", () => {
    expect(solveStar1(input)).toBe(1494342);
  });

  it("should pass test for star 2", () => {
    expect(solveStar2(testInput)).toBe(1206);
  });

  it("should pass test 2 for star 2", () => {
    expect(solveStar2(testInput2)).toBe(368);
  });

  it("should solve star 2", () => {
    const res = solveStar2(input);
    expect(res).not.toBe(1494342);
    expect(res).not.toBe(903798);
    expect(res).toBe(893676);
  });
});
