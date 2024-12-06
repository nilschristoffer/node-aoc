interface Guard {
  position: Position;
  previousPositions: { [x: number]: { [y: number]: Position["direction"][] } };
}

interface Position {
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
}

const moveForward = ({ previousPositions, position }: Guard) => {
  if (!previousPositions[position.x]) {
    previousPositions[position.x] = {};
  }
  if (!previousPositions[position.x][position.y]) {
    previousPositions[position.x][position.y] = [];
  }
  previousPositions[position.x][position.y].push(position.direction);
  switch (position.direction) {
    case "up":
      position.y--;
      break;
    case "down":
      position.y++;
      break;
    case "left":
      position.x--;
      break;
    case "right":
      position.x++;
      break;
  }
};

const turnRight = ({ position }: Guard) => {
  switch (position.direction) {
    case "up":
      position.direction = "right";
      break;
    case "down":
      position.direction = "left";
      break;
    case "left":
      position.direction = "up";
      break;
    case "right":
      position.direction = "down";
      break;
  }
};

const hasObstacleAhead = (input: string[], guard: Guard) => {
  const { x, y } = guard.position;
  switch (guard.position.direction) {
    case "up":
      return input[y - 1]?.[x] === "#";
    case "down":
      return input[y + 1]?.[x] === "#";
    case "left":
      return input[y]?.[x - 1] === "#";
    case "right":
      return input[y]?.[x + 1] === "#";
  }
};

const isInMap = (input: string[], guard: Guard) => {
  const { x, y } = guard.position;
  return y >= 0 && y < input.length && x >= 0 && x < input[0].length;
};

const walkOutsideMap = (input: string[], guard: Guard) => {
  while (isInMap(input, guard)) {
    if (hasObstacleAhead(input, guard)) {
      turnRight(guard);
    } else {
      moveForward(guard);
    }

    if (
      guard.previousPositions[guard.position.x]?.[guard.position.y]?.includes(
        guard.position.direction
      )
    ) {
      // loop
      return false;
    }
  }

  // success
  return true;
};

export const solveStar1 = (input: string[]) => {
  const guardY = input.findIndex((line) => line.includes("^"));
  const guardX = input[guardY].indexOf("^");

  const guard: Guard = {
    position: { x: guardX, y: guardY, direction: "up" },
    previousPositions: [],
  };

  walkOutsideMap(input, guard);

  return Object.values(guard.previousPositions).flatMap((x) => Object.values(x))
    .length;
};

const putObstacle = (input: string[], position: Pick<Position, "x" | "y">) => {
  const { x, y } = position;
  let newInput = [...input];
  newInput[y] = newInput[y].slice(0, x) + "#" + newInput[y].slice(x + 1);
  return newInput;
};

export const solveStar2 = (input: string[]) => {
  const guardY = input.findIndex((line) => line.includes("^"));
  const guardX = input[guardY].indexOf("^");

  const guard: Guard = {
    position: { x: guardX, y: guardY, direction: "up" },
    previousPositions: [],
  };

  walkOutsideMap(input, guard);

  const possibleObstaclePositions = Object.keys(
    guard.previousPositions
  ).flatMap((x) =>
    Object.keys(guard.previousPositions[Number(x)]).map((y) => ({
      x: Number(x),
      y: Number(y),
    }))
  );

  const loopPositions = possibleObstaclePositions.filter((position) => {
    return !walkOutsideMap(putObstacle(input, position), {
      position: { x: guardX, y: guardY, direction: "up" },
      previousPositions: [],
    });
  });

  return loopPositions.length;
};
