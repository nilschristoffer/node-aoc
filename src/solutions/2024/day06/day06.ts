interface Guard {
  position: Position;
  previousPositions: { [x: number]: { [y: number]: Position["direction"][] } };
}

interface Position {
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
}

const moveForward = (guard: Guard) => {
  if (!guard.previousPositions[guard.position.x]) {
    guard.previousPositions[guard.position.x] = {};
  }
  if (!guard.previousPositions[guard.position.x][guard.position.y]) {
    guard.previousPositions[guard.position.x][guard.position.y] = [];
  }
  guard.previousPositions[guard.position.x][guard.position.y].push(
    guard.position.direction
  );
  switch (guard.position.direction) {
    case "up":
      guard.position.y--;
      break;
    case "down":
      guard.position.y++;
      break;
    case "left":
      guard.position.x--;
      break;
    case "right":
      guard.position.x++;
      break;
  }
};

const turnRight = (guard: Guard) => {
  switch (guard.position.direction) {
    case "up":
      guard.position.direction = "right";
      break;
    case "down":
      guard.position.direction = "left";
      break;
    case "left":
      guard.position.direction = "up";
      break;
    case "right":
      guard.position.direction = "down";
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

export const solveStar1 = (input: string[]) => {
  // find \^
  const guardY = input.findIndex((line) => line.includes("^"));
  const guardX = input[guardY].indexOf("^");

  const guard: Guard = {
    position: { x: guardX, y: guardY, direction: "up" },
    previousPositions: [],
  };

  while (isInMap(input, guard)) {
    if (hasObstacleAhead(input, guard)) {
      turnRight(guard);
    } else {
      moveForward(guard);
    }
  }

  return Object.values(guard.previousPositions).flatMap((x) => Object.values(x))
    .length;
};

const isLooping = (input: string[], guard: Guard) => {
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
      return true;
    }
  }
  return false;
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

  while (isInMap(input, guard)) {
    if (hasObstacleAhead(input, guard)) {
      turnRight(guard);
    } else {
      moveForward(guard);
    }
  }

  const possibleObstaclePositions: { x: number; y: number }[] = Object.keys(
    guard.previousPositions
  ).flatMap((x) =>
    Object.keys(guard.previousPositions[Number(x)]).map((y) => ({
      x: Number(x),
      y: Number(y),
    }))
  );

  const loopPositions = possibleObstaclePositions.filter((position) => {
    return isLooping(putObstacle(input, position), {
      position: { x: guardX, y: guardY, direction: "up" },
      previousPositions: [],
    });
  });

  return loopPositions.length;
};
