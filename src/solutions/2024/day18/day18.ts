interface Point {
  x: number;
  y: number;
}

interface PathPoint extends Point {
  visited: { [y: number]: { [x: number]: boolean } };
  steps: number;
  path: Point[];
}

const manhattanDistance = (a: Point, b: Point) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const aStarScore = (curr: PathPoint, goal: Point) => {
  return curr.steps + manhattanDistance(curr, goal);
};

const findPath = (input: string[], size: number, bytes: number) => {
  const points = input.slice(0, bytes).reduce((acc, line) => {
    const [x, y] = line.split(",").map(Number);
    return {
      ...acc,
      [y]: {
        ...(acc[y] || {}),
        [x]: true,
      },
    };
  }, {} as { [y: number]: { [x: number]: boolean } });

  let start = { x: 0, y: 0 };
  let end = { x: size, y: size };

  let queue: PathPoint[] = [{ ...start, visited: points, steps: 0, path: [] }];

  while (queue.length > 0) {
    queue.sort((a, b) => aStarScore(a, end) - aStarScore(b, end));
    const current = queue.shift()!;
    if (current.x === end.x && current.y === end.y) {
      return current;
    }

    const above = { ...current, y: current.y - 1 };
    const below = { ...current, y: current.y + 1 };
    const left = { ...current, x: current.x - 1 };
    const right = { ...current, x: current.x + 1 };

    const neighbors = [above, below, left, right].filter(
      (neighbor) =>
        !neighbor.visited[neighbor.y]?.[neighbor.x] &&
        neighbor.y >= 0 &&
        neighbor.x >= 0 &&
        neighbor.y <= size &&
        neighbor.x <= size
    );

    if (neighbors.length === 0) {
      continue;
    }

    neighbors.forEach((neighbor) => {
      neighbor.visited[neighbor.y] = neighbor.visited[neighbor.y] || {};
      neighbor.visited[neighbor.y][neighbor.x] = true;
      neighbor.steps++;
      neighbor.path = [...current.path, current];
      queue.push(neighbor);
    });
  }

  return null;
};

export const solveStar1 = (input: string[], size: number, bytes: number) => {
  const path = findPath(input, size, bytes);
  return path?.steps;
};

export const solveStar2 = (
  input: string[],
  size: number,
  startByteIndex: number
) => {
  let testByteIndex = startByteIndex;
  let path = findPath(input, size, testByteIndex);
  while (true) {
    testByteIndex++;
    const [x, y] = input[testByteIndex].split(",").map(Number);
    if (path?.visited[y]?.[x]) {
      path = findPath(input, size, testByteIndex);
      if (!path) {
        return input[testByteIndex - 1];
      }
    }
  }
};
