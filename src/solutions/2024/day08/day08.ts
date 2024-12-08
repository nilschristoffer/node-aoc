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

const isWithinMap = (input: string[], { x, y }: Location) => {
  return x >= 0 && x < input[0].length && y >= 0 && y < input.length;
};

const isEqualLocation = (loc1: Location, loc2: Location) => {
  return loc1.x === loc2.x && loc1.y === loc2.y;
};

const getAntiNodes = (loc1: Location, loc2: Location): Location[] => {
  const diffX = loc1.x - loc2.x;
  const diffY = loc1.y - loc2.y;

  const antiNode2 = { x: loc2.x - diffX, y: loc2.y - diffY };
  const antiNode3 = { x: loc1.x + diffX, y: loc1.y + diffY };

  return [antiNode2, antiNode3].filter(
    (an) => !isEqualLocation(loc1, an) && !isEqualLocation(loc2, an)
  );
};

const getAllAntiNodes = (locations: Location[]) => {
  const antiNodes: Location[] = [];
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      antiNodes.push(...getAntiNodes(locations[i], locations[j]));
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
  const antennasByFreq: AntennasByFrequency = mapInput(input);
  const antinodes = Object.values(antennasByFreq).flatMap((antennas) => {
    return getAllAntiNodes(antennas).filter((loc) => isWithinMap(input, loc));
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
  let antiNodesCandidate1: Location = loc1;
  while (
    antiNodesCandidate1.x >= 0 &&
    antiNodesCandidate1.x < width &&
    antiNodesCandidate1.y >= 0 &&
    antiNodesCandidate1.y < height
  ) {
    antiNodes.push({
      x: antiNodesCandidate1.x,
      y: antiNodesCandidate1.y,
    });
    antiNodesCandidate1 = {
      x: antiNodesCandidate1.x - diffX,
      y: antiNodesCandidate1.y - diffY,
    };
  }

  let antiNodesCandidate2: Location = loc2;
  while (
    antiNodesCandidate2.x >= 0 &&
    antiNodesCandidate2.x < width &&
    antiNodesCandidate2.y >= 0 &&
    antiNodesCandidate2.y < height
  ) {
    antiNodes.push({
      x: antiNodesCandidate2.x,
      y: antiNodesCandidate2.y,
    });
    antiNodesCandidate2 = {
      x: antiNodesCandidate2.x + diffX,
      y: antiNodesCandidate2.y + diffY,
    };
  }

  return antiNodes;
};

const getAllContinuousAntiNodes = (
  locations: Location[],
  width: number,
  height: number
) => {
  const antiNodes: Location[] = [];
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      antiNodes.push(
        ...getContinuousAntinodes(locations[i], locations[j], width, height)
      );
    }
  }
  return antiNodes;
};

export const solveStar2 = (map: string[]) => {
  const antennasByFreq: AntennasByFrequency = mapInput(map);
  const antinodes = Object.values(antennasByFreq).flatMap((antennas) => {
    return getAllContinuousAntiNodes(antennas, map[0].length, map.length);
  });

  return uniqueLocations(antinodes).length;
};
