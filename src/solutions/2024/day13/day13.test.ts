import { textReaderArr } from "../../../utils/textReader";
import { solveStar1, solveStar2 } from "./day13";
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
    expect(solveStar1(testInput)).toBe(480);
  });

  it("should solve star 1", () => {
    expect(solveStar1(input)).toBe(36758);
  });

  it("should pass test for star 2", () => {
    // expect(solveStar2(testInput)).toBe(null);
  });

  it("should solve star 2", () => {
    expect(solveStar2(input)).toBe("Answer 2: ");
  });
});
