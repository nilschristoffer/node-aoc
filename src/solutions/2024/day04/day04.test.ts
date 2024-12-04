import { textReaderArr } from "../../../utils/textReader";
import {
  countAppearances,
  extract3x3,
  isXMAS,
  makeDiagonalsTopLeft,
  rotate90degClockwise,
  rotateDeg,
  solveStar1,
  solveStar2,
  transpose,
} from "./day04";
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
  it("should make diagonals top left", () => {
    expect(makeDiagonalsTopLeft(["AB", "CD"])).toEqual(["B", "AD", "C"]);
  });

  it("should count appearances", () => {
    expect(countAppearances("FOOASFOO13FOO", "FOO")).toBe(3);
  });

  it("should transpose", () => {
    expect(transpose(["ABC", "DEF"])).toEqual(["AD", "BE", "CF"]);
  });

  it("should pass test", () => {
    expect(solveStar1(testInput)).toBe(18);
  });

  it("should solve star 1", () => {
    expect(solveStar1(input)).toBe(2524);
  });

  it("should extract 3x3", () => {
    const input = ["ABCD", "EFGH", "IJKL", "MNOP"];
    expect(extract3x3(input, 1, 1)).toEqual(["FGH", "JKL", "NOP"]);
  });

  it("should find XMAS", () => {
    const input = ["M.S", ".A.", "M.S"];
    expect(isXMAS(input)).toBe(true);
  });

  it("should rotate 90 degrees", () => {
    const input = ["123", "456", "789"];
    expect(rotate90degClockwise(input)).toEqual(["741", "852", "963"]);
  });

  it("should rotate 180 degrees", () => {
    const input = ["M.S", ".A.", "M.S"];
    expect(rotateDeg(input, 180)).toEqual(["S.M", ".A.", "S.M"]);
  });

  it("should pass test for star 2", () => {
    expect(solveStar2(testInput)).toBe(9);
  });

  it("should solve star 2", () => {
    expect(solveStar2(input)).toBe(1873);
  });
});
