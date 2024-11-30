import fs from "fs/promises";
import path from "path";

import { getInput } from "../api/getInput";
import { getProblem } from "../api/getProblem";
import {
  colog,
  promptAnswer,
  promptDay,
  promptYear,
} from "../api/helpers/helpers";
import { postSolution } from "../api/postSolution";
import { program } from "commander";
import ora from "ora";

const promptSolve = async (year: string, day: string, part: 1 | 2) => {
  const ans = await promptAnswer({
    message: `Solution star ${part} [Enter to skip]:`,
  });

  if (ans) {
    const spinner = ora(`Posting solution star ${part}...`).start();
    const { res, info } = await postSolution(
      Number(year),
      Number(day),
      part,
      ans
    );
    switch (res) {
      case "SOLVED":
        spinner.succeed(`Solution star ${part} solved!`);
        info && colog.succ(info);
        break;
      case "WAIT":
        spinner.warn(`You have to wait...`);
        info && colog.warn(info);
        break;
      default:
        spinner.fail(`Star ${part} was not solved...`);
        info && colog.err(info);
        break;
    }
  } else {
    colog.warn(`No solution for star ${part} provided!`);
  }
};

program.version("1.0.0").description("Get aoc files for a specific day");

const sourceDir = path.join(__dirname, "..", "api", "day00");
const sourceFiles = {
  test: path.join(sourceDir, `day00.test`),
  solution: path.join(sourceDir, `day00`),
};

program.action(async () => {
  const year = await promptYear();
  const day = await promptDay();

  const yearDir = path.join(__dirname, "..", "solutions", year);
  const dayDir = path.join(yearDir, `day${day}`);
  const outputFiles = {
    test: path.join(dayDir, `day${day}.test.ts`),
    solution: path.join(dayDir, `day${day}.ts`),
    testInput: path.join(dayDir, "test.txt"),
    prob: path.join(dayDir, "problem.html"),
    input: path.join(dayDir, "input.txt"),
  };

  const yearSpinner = ora(`Checking for year ${year} directory...`).start();
  try {
    await fs.stat(yearDir);
    yearSpinner.succeed(`Year ${year} directory found!`);
  } catch (e) {
    yearSpinner.text = `Creating year ${year} directory. ..`;
    await fs.mkdir(yearDir);
    yearSpinner.succeed(`Year ${year} directory created successfully!`);
  }

  const daySpinner = ora(`Checking for day ${day} directory...`).start();
  try {
    await fs.stat(dayDir);
    daySpinner.succeed(`Day ${day} directory found!`);
  } catch (e) {
    daySpinner.text = `Creating day ${day} directory...`;
    await fs.mkdir(dayDir);
    daySpinner.succeed(`Day ${day} directory created successfully!`);
  }

  // day.ts
  const dayFileSpinner = ora(`Creating day${day}.ts...`).start();
  await fs.copyFile(sourceFiles.solution, outputFiles.solution);
  dayFileSpinner.succeed(`day${day}.ts created successfully!`);

  // day.test.ts
  const testFileSpinner = ora(`Creating day${day}.test.ts...`).start();
  const testFileSrc = await fs.readFile(sourceFiles.test, "utf8");
  await fs.writeFile(
    outputFiles.test,
    testFileSrc.replace("day00", `day${day}`)
  );
  testFileSpinner.succeed(`day${day}.test.ts created successfully!`);

  // test.txt
  const testInputSpinner = ora(`Checking test.txt...`).start();
  try {
    await fs.stat(outputFiles.testInput);
    testInputSpinner.warn(`test.txt found! Skipping creation...`);
  } catch (e) {
    testInputSpinner.text = "Creating test.txt...";
    await fs.writeFile(outputFiles.testInput, "");
    testInputSpinner.succeed(`test.txt created successfully!`);
  }

  // test2.txt
  const testInput2Spinner = ora(`Checking test2.txt...`).start();
  try {
    await fs.stat(path.join(dayDir, "test2.txt"));
    testInput2Spinner.warn(`test2.txt found! Skipping creation...`);
  } catch (e) {
    testInput2Spinner.text = "Creating test2.txt...";
    await fs.writeFile(path.join(dayDir, "test2.txt"), "");
    testInput2Spinner.succeed(`test2.txt created successfully!`);
  }

  // input.txt
  const inputSpinner = ora(`Fetching input...`).start();
  const input = await getInput(Number(day), Number(year));
  if (input) {
    inputSpinner.text = "Input found! Creating input.txt...";
    await fs.writeFile(outputFiles.input, input);
    inputSpinner.succeed(`input.txt created successfully!`);
  } else {
    inputSpinner.fail("Input not found!");
  }

  // problem.html
  const probSpinner = ora(`Fetching problem...`).start();
  const prob = await getProblem(Number(year), Number(day));
  if (prob) {
    probSpinner.text = "Problem found! Creating problem.html...";
    await fs.writeFile(outputFiles.prob, prob);
    probSpinner.succeed(`problem.html created successfully!`);
  } else {
    probSpinner.fail("Problem not found!");
  }

  colog.succ(`\nDay ${day} initialized successfully!`);

  await promptSolve(year, day, 1);
  await promptSolve(year, day, 2);
});

program.parse(process.argv);
