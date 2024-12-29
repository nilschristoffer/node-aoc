import { splitInChunks } from "../../../utils/helpers";

type SchematicType = "Lock" | "Key";

interface Schematic {
  type: SchematicType;
  heights: number[];
}

const transpose = (input: string[]): string[] => {
  const res = [];
  for (let i = 0; i < input[0].length; i++) {
    res.push(input.map((line) => line[i]).join(""));
  }
  return res;
};

const parseSchematics = (input: string[]): Schematic => {
  const type = input[0][0] === "#" ? "Lock" : "Key";

  const heights = transpose(input).map((line) =>
    line
      .split("")
      .reduce<number>((acc, curr) => acc + (curr === "#" ? 1 : 0), -1)
  );
  return { type, heights };
};

const fits = (key: Schematic, lock: Schematic) =>
  key.heights.every((height, i) => height + lock.heights[i] < 6);

export const solveStar1 = (input: string[]) => {
  const schematics = splitInChunks(input, 8).map(parseSchematics);

  const [keys, locks] = (["Key", "Lock"] as SchematicType[]).map((type) =>
    schematics.filter((schematic) => schematic.type === type)
  );

  const fitCounts = locks.map(
    (lock) => keys.filter((key) => fits(key, lock)).length
  );

  return fitCounts.reduce((acc, curr) => acc + curr, 0);
};

export const solveStar2 = (input: string[]) => {
  return input.length;
};
