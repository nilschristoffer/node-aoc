interface Location {
  x: number;
  y: number;
}

type AntennasByFrequency = {
  [frequency: string]: Location[];
};

const mapInput = (input: string[]): AntennasByFrequency => {
  const antennas: AntennasByFrequency = {};
  input.forEach((row, y) => {
    row.split("").forEach((char, x) => {
      if (char !== ".") {
        antennas[char] = antennas[char] || [];
        antennas[char].push({ x, y });
      }
    });
  });
  return antennas;
};

const isWithinMap = ({ x, y }: Location, width: number, height: number) => {
  return x >= 0 && x < width && y >= 0 && y < height;
};

const isEqualLocation = (
  { x: x1, y: y1 }: Location,
  { x: x2, y: y2 }: Location
) => {
  return x1 === x2 && y1 === y2;
};

const getAntiNodes = (loc1: Location, loc2: Location): Location[] => {
  const diffX = loc1.x - loc2.x;
  const diffY = loc1.y - loc2.y;

  const antiNode1 = { x: loc2.x - diffX, y: loc2.y - diffY };
  const antiNode2 = { x: loc1.x + diffX, y: loc1.y + diffY };

  return [antiNode1, antiNode2];
};

const getAllAntiNodes = (
  locations: Location[],
  method: (loc1: Location, loc2: Location) => Location[]
) => {
  const antiNodes: Location[] = [];
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      antiNodes.push(...method(locations[i], locations[j]));
    }
  }
  return antiNodes;
};

const uniqueLocations = (locations: Location[]): Location[] => {
  const uniqueLocations: Location[] = [];
  locations.forEach((loc) => {
    if (!uniqueLocations.some((ul) => isEqualLocation(ul, loc))) {
      uniqueLocations.push(loc);
    }
  });
  return uniqueLocations;
};

export const solveStar1 = (input: string[]) => {
  const width = input[0].length;
  const height = input.length;
  const antennasByFreq: AntennasByFrequency = mapInput(input);
  const antinodes = Object.values(antennasByFreq).flatMap((antennas) => {
    return getAllAntiNodes(antennas, getAntiNodes).filter((loc) =>
      isWithinMap(loc, width, height)
    );
  });

  return uniqueLocations(antinodes).length;
};

const getContinuousAntinodes = (
  loc1: Location,
  loc2: Location,
  width: number,
  height: number
) => {
  const diffX = loc1.x - loc2.x;
  const diffY = loc1.y - loc2.y;
  const antiNodes: Location[] = [];
  let candidate1: Location = loc1;
  while (isWithinMap(candidate1, width, height)) {
    antiNodes.push(candidate1);
    candidate1 = {
      x: candidate1.x - diffX,
      y: candidate1.y - diffY,
    };
  }

  let candidate2: Location = loc2;
  while (isWithinMap(candidate2, width, height)) {
    antiNodes.push(candidate2);
    candidate2 = {
      x: candidate2.x + diffX,
      y: candidate2.y + diffY,
    };
  }

  return antiNodes;
};

export const solveStar2 = (map: string[]) => {
  const antennasByFreq: AntennasByFrequency = mapInput(map);
  const antinodes = Object.values(antennasByFreq).flatMap((antennas) => {
    return getAllAntiNodes(antennas, (l1, l2) =>
      getContinuousAntinodes(l1, l2, map[0].length, map.length)
    );
  });

  return uniqueLocations(antinodes).length;
};
