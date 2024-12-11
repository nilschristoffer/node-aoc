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
    newStones: number[];
    stonesToEnd?: { [step: number]: number };
  };
};

const reArrangeRecursive = (stone: number, stoneRecord: StoneRecord = {}) => {
  if (stoneRecord[stone]) {
    return stoneRecord;
  }

  const newStones = reArrange(stone);
  stoneRecord[stone] = {
    newStones,
  };
  newStones.forEach((stone) => {
    stoneRecord = reArrangeRecursive(stone, stoneRecord);
  });

  return stoneRecord;
};

export const solveStar2 = (input: string[], times: number) => {
  const stones = parseInput(input);
  let records = stones.reduce(
    (acc, curr) => reArrangeRecursive(curr, acc),
    {} as StoneRecord
  );

  for (let step = 0; step <= times; step++) {
    records = Object.entries(records).reduce<StoneRecord>(
      (acc, [stone, { newStones, stonesToEnd }]) => {
        acc[Number(stone)] = {
          ...acc[Number(stone)],
          stonesToEnd: {
            ...stonesToEnd,
            [step]:
              step === 0
                ? 1
                : newStones
                    .map(Number)
                    .reduce(
                      (prev, ns) => prev + acc[ns].stonesToEnd?.[step - 1]!,
                      0
                    ),
          },
        };

        return acc;
      },
      records as StoneRecord
    );
  }

  return stones.reduce(
    (acc, curr) => acc + (records[curr].stonesToEnd?.[times] || 0),
    0
  );
};
