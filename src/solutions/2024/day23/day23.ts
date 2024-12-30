interface Connection {
  from: string;
  to: string;
}

const parseInput = (input: string[]): Connection[] => {
  return input.map((line) => {
    const [from, to] = line.split("-");
    return { from, to };
  });
};

export const solveStar1 = (input: string[]) => {
  const connections = parseInput(input);

  const dir: { [a: string]: { [b: string]: boolean } } = {};

  connections.forEach(({ from, to }) => {
    dir[from] = dir[from] || {};
    dir[from][to] = true;

    dir[to] = dir[to] || {};
    dir[to][from] = true;
  });

  const allKeys = Object.keys(dir);
  const tripples: string[][] = [];
  for (let a = 0; a < allKeys.length; a++) {
    const aKey = allKeys[a];
    for (let b = a + 1; b < allKeys.length; b++) {
      const bKey = allKeys[b];
      for (let c = b + 1; c < allKeys.length; c++) {
        const cKey = allKeys[c];
        if (dir[aKey][bKey] && dir[bKey][cKey] && dir[cKey][aKey]) {
          tripples.push([aKey, bKey, cKey]);
        }
      }
    }
  }

  return tripples.filter((t) => t.some((k) => k.startsWith("t"))).length;
};

export const solveStar2 = (input: string[]) => {
  const connections = parseInput(input);

  const connectsToDir: { [key: string]: string[] } = {};

  connections.forEach(({ from, to }) => {
    connectsToDir[from] = connectsToDir[from] || [];
    connectsToDir[from].push(to);

    connectsToDir[to] = connectsToDir[to] || [];
    connectsToDir[to].push(from);
  });

  const sets: string[][] = [];

  const filterConnectedToEachOther = (names: string[]) => {
    const [first, ...rest] = names;
    return rest.reduce<string[]>(
      (acc, curr) => {
        acc.every((a) => connectsToDir[a].includes(curr)) && acc.push(curr);
        return acc;
      },
      [first]
    );
  };

  Object.keys(connectsToDir).forEach((key) => {
    if (connectsToDir[key].length === 1) {
      sets.push([key, connectsToDir[key][0]]);
    }

    const filtered = filterConnectedToEachOther(connectsToDir[key]);
    if (filtered.length > 0) {
      sets.push([key, ...filtered]);
    }
  });

  const longestSet = sets.reduce((acc, curr) => {
    return curr.length > acc.length ? curr : acc;
  }, []);

  longestSet.sort();

  return longestSet.join(",");
};
