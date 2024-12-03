const mulRegex = /mul\(\d+,\d+\)/;

const doRegex = /do\(\)/;

const dontRegex = /don't\(\)/;

const findMuls = (input: string[]) =>
  input.join("").match(new RegExp(mulRegex.source, "g")) || [];

export const solveStar1 = (input: string[]) => {
  const muls = findMuls(input);

  return Array.from(new Set(muls)).reduce((acc, curr) => {
    const [x, y] = curr.slice(4, -1).split(",").map(Number);
    return acc + x * y;
  }, 0);
};

const findAllStatements = (input: string[]) =>
  input
    .join("")
    .match(
      new RegExp(
        [doRegex.source, dontRegex.source, mulRegex.source].join("|"),
        "g"
      )
    ) || [];

export const solveStar2 = (input: string[]) => {
  const statements = findAllStatements(input);
  let enabled = true;

  return statements.reduce((acc, curr) => {
    if (curr.includes("do(")) {
      enabled = true;
      return acc;
    }
    if (curr.includes("don")) {
      enabled = false;
      return acc;
    }
    if (enabled && curr.includes("mul")) {
      const [x, y] = curr.slice(4, -1).split(",");
      return acc + Number(x) * Number(y);
    }

    return acc;
  }, 0);
};
