interface Point {
  x: number;
  y: number;
  height: number;
}

interface Trail {
  head: Point;
  tail: Point;
}

const parseInput = (input: string[]): Point[][] => {
  return input.map((line, y) => {
    return line.split("").map((char, x) => {
      return {
        height: Number(char),
        x,
        y,
      };
    });
  });
};

const trail = (trailHead: Point, map: Point[][]): Trail[] => {
  const trails = [
    {
      head: trailHead,
      tail: trailHead,
    },
  ];

  let currentTrailIndex = 0;
  while (currentTrailIndex < trails.length) {
    const currentTrail = trails[currentTrailIndex];
    const { x, y, height } = currentTrail.tail;

    const above = map[y - 1]?.[x];
    const below = map[y + 1]?.[x];
    const left = map[y]?.[x - 1];
    const right = map[y]?.[x + 1];

    const neighbors = [above, below, left, right].filter(
      (neighbor) => neighbor?.height === height + 1
    );

    if (neighbors.length === 0) {
      currentTrailIndex++;
      continue;
    }

    if (neighbors.length > 0) {
      currentTrail.tail = neighbors.pop()!;
      neighbors.forEach((neighbor) => {
        trails.push({
          head: currentTrail.head,
          tail: neighbor,
        });
      });
    }
  }

  return trails;
};

const score = (trails: Trail[]) => {
  const trailRecord = trails.reduce<{ [x: number]: { [y: number]: number } }>(
    (acc, curr) => {
      acc[curr.tail.x] = acc[curr.tail.x] || {};
      acc[curr.tail.x][curr.tail.y] = curr.tail.height;
      return acc;
    },
    {}
  );
  return Object.keys(trailRecord).reduce((acc, x) => {
    return (
      acc + Object.values(trailRecord[Number(x)]).filter((h) => h === 9).length
    );
  }, 0);
};

export const solveStar1 = (input: string[]) => {
  const map = parseInput(input);
  const trailHeads = map.flatMap((point) =>
    point.filter((point) => point.height === 0)
  );

  const trails = trailHeads.map((head) => trail(head, map));

  return trails.reduce((acc, curr) => acc + score(curr), 0);
};

const rating = (trails: Trail[]) => {
  return trails.filter(({ tail }) => tail.height === 9).length;
};

export const solveStar2 = (input: string[]) => {
  const map = parseInput(input);
  const trailHeads = map.flatMap((point) =>
    point.filter((point) => point.height === 0)
  );

  const trails = trailHeads.map((head) => trail(head, map));

  return trails.reduce((acc, curr) => acc + rating(curr), 0);
};
