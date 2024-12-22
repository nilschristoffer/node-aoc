const parseInput = (input: string[]) => {
  return input[0].split(" ").map(Number);
};

const reArrange = (stone: number): number[] => {
  if (stone === 0) {
    return [1];
  }
  const stoneStr = stone.toString();
  if (stoneStr.length % 2 === 0) {
    return [
      Number(stoneStr.slice(0, stoneStr.length / 2)),
      Number(stoneStr.slice(stoneStr.length / 2)),
    ];
  }
  return [stone * 2024];
};

const blink = (stones: number[]) => {
  return stones.flatMap(reArrange);
};

export const solveStar1 = (input: string[], times = 25) => {
  let stones = parseInput(input);
  for (let i = 0; i < times; i++) {
    stones = blink(stones);
  }

  return stones.length;
};

type StoneRecord = {
  [stone: number]: {
    nextStones: number[];
  };
};

const reArrangeRecursive = (stoneRecord: StoneRecord, stone: number) => {
  if (stoneRecord[stone]) {
    return stoneRecord;
  }

  const nextStones = reArrange(stone);
  stoneRecord[stone] = {
    nextStones,
  };
  nextStones.forEach((stone) => {
    stoneRecord = reArrangeRecursive(stoneRecord, stone);
  });

  return stoneRecord;
};

type StonesToEndRecord = { [number: string]: { [step: number]: number } };

export const solveStar2 = (input: string[], times: number) => {
  const stones = parseInput(input);
  const tree = stones.reduce<StoneRecord>(reArrangeRecursive, {});

  const res = Array.from({
    length: times + 1,
  }).reduce<StonesToEndRecord>((acc, _, step) => {
    Object.entries(tree).forEach(([stone, { nextStones: newStones }]) => {
      acc[stone] = acc[stone] || {};
      acc[stone][step] = newStones.reduce(
        (sum, ns) => sum + acc[ns]?.[step - 1] || 1,
        0
      );
    });
    return acc;
  }, {});

  return stones.reduce((acc, curr) => acc + (res[curr][times] || 0), 0);
};
