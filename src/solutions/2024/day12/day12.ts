interface Point<T> {
  val: T;
  x: number;
  y: number;
}

interface Region {
  id: string;
  char: string;
  points: { [x: number]: { [y: number]: true } };
}

const parseRegions = (input: string[]): Region[] => {
  const regions: Region[] = [];
  const visitedWithRegion: { [x: number]: { [y: number]: string } } = {};

  const queue = input.flatMap((line, y) =>
    line.split("").map((char, x) => ({ val: char, x, y }))
  );

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visitedWithRegion[current.y]?.[current.x]) {
      continue;
    }

    const above: Point<string> = {
      val: input[current.y - 1]?.[current.x],
      x: current.x,
      y: current.y - 1,
    };
    const below: Point<string> = {
      val: input[current.y + 1]?.[current.x],
      x: current.x,
      y: current.y + 1,
    };
    const left: Point<string> = {
      val: input[current.y]?.[current.x - 1],
      x: current.x - 1,
      y: current.y,
    };
    const right: Point<string> = {
      val: input[current.y]?.[current.x + 1],
      x: current.x + 1,
      y: current.y,
    };

    const similarNeighbors: Point<string>[] = [
      above,
      below,
      left,
      right,
    ].filter((neighbor) => neighbor.val === current.val);

    const visitedNeighbors = similarNeighbors
      .map((neighbor) => {
        return visitedWithRegion[neighbor.y]?.[neighbor.x];
      })
      .filter((val) => !!val);

    const unvisitedNeighbors = similarNeighbors.filter((neighbor) => {
      return !visitedWithRegion[neighbor.y]?.[neighbor.x];
    });

    if (visitedNeighbors.length > 0) {
      const regionId = visitedNeighbors[0];

      const region = regions.find((r) => r.id === regionId);

      if (!region) {
        throw new Error("Region not found");
      }

      region.points[current.x] = region.points[current.x] || {};
      region.points[current.x][current.y] = true;
      visitedWithRegion[current.y] = visitedWithRegion[current.y] || {};
      visitedWithRegion[current.y][current.x] = region.id;
    } else {
      const newRegionId = String(regions.length);
      regions.push({
        id: newRegionId,
        char: current.val,
        points: {
          [current.x]: {
            [current.y]: true,
          },
        },
      });

      visitedWithRegion[current.y] = visitedWithRegion[current.y] || {};
      visitedWithRegion[current.y][current.x] = newRegionId;
    }

    unvisitedNeighbors.forEach((neighbor) => {
      queue.unshift(neighbor);
    });
  }

  return regions;
};

const perimeter = (region: Region, map: string[]) => {
  return Object.keys(region.points).reduce((tot, x) => {
    return (
      tot +
      Object.keys(region.points[Number(x)]).reduce((subtot, y) => {
        return (
          subtot +
          (map[Number(y) - 1]?.[Number(x)] === region.char ? 0 : 1) +
          (map[Number(y) + 1]?.[Number(x)] === region.char ? 0 : 1) +
          (map[Number(y)]?.[Number(x) - 1] === region.char ? 0 : 1) +
          (map[Number(y)]?.[Number(x) + 1] === region.char ? 0 : 1)
        );
      }, 0)
    );
  }, 0);
};

const area = (region: Region) => {
  return Object.keys(region.points).reduce((acc, x) => {
    return acc + Object.keys(region.points[Number(x)]).length;
  }, 0);
};

const countCorners = (region: Region) => {
  let count = 0;
  const points = Object.keys(region.points).flatMap((x) =>
    Object.keys(region.points[Number(x)]).map((y) => ({
      val: undefined,
      x: Number(x),
      y: Number(y),
    }))
  );

  points.forEach((point) => {
    const n = region.points[point.x]?.[point.y - 1];
    const e = region.points[point.x + 1]?.[point.y];
    const s = region.points[point.x]?.[point.y + 1];
    const w = region.points[point.x - 1]?.[point.y];
    const nw = region.points[point.x - 1]?.[point.y - 1];
    const ne = region.points[point.x + 1]?.[point.y - 1];
    const se = region.points[point.x + 1]?.[point.y + 1];
    const sw = region.points[point.x - 1]?.[point.y + 1];

    if (!n && !w) {
      count++;
    }

    if (!w && !s) {
      count++;
    }

    if (!s && !e) {
      count++;
    }

    if (!e && !n) {
      count++;
    }

    if (n && w && !nw) {
      count++;
    }

    if (w && s && !sw) {
      count++;
    }

    if (s && e && !se) {
      count++;
    }

    if (e && n && !ne) {
      count++;
    }
  });

  return count;
};

export const solveStar1 = (input: string[]) => {
  const regions = parseRegions(input);

  return Object.values(regions).reduce(
    (acc, curr) => acc + perimeter(curr, input) * area(curr),
    0
  );
};

export const solveStar2 = (input: string[]) => {
  const regions = parseRegions(input);

  return Object.values(regions).reduce(
    (acc, curr) => acc + countCorners(curr) * area(curr),
    0
  );
};
