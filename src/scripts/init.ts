import fs from "fs/promises";
import path from "path";

import { getInput } from "../api/getInput";
import { getProblem } from "../api/getProblem";
import { colog } from "../api/helpers/helpers";
import { postSolution } from "../api/postSolution";
import { exec } from "child_process";
import { program } from "commander";
import inquirer from "inquirer";
import ora from "ora";

program.version("1.0.0").description("Get aoc files for a specific day");

program.action(async () => {
  let { day, year } = await inquirer.prompt([
    {
      type: "input",
      name: "day",
      message: "Select day:",
      default: new Date().getDate().toString(),
      transformer: (input) => input.padStart(2, "0"),
    },
    {
      type: "input",
      name: "year",
      message: "Select year:",
      default: new Date().getFullYear().toString(),
    },
  ]);

  day = day.padStart(2, "0");

  const yearDir = path.join(__dirname, "..", "solutions", year.toString());
  const dayDir = path.join(yearDir, `day${day}`);
  const outputFiles = {
    test: path.join(dayDir, `day${day}.test.ts`),
    solution: path.join(dayDir, `day${day}.ts`),
    testInput: path.join(dayDir, "test.txt"),
    prob: path.join(dayDir, "problem.html"),
    input: path.join(dayDir, "input.txt"),
  };

  const sourceDir = path.join(__dirname, "..", "api", "day00");
  const sourceFiles = {
    test: path.join(sourceDir, `day00.test`),
    solution: path.join(sourceDir, `day00`),
  };

  try {
    await fs.stat(yearDir);
    colog.succ(`Year ${year} directory found!`);
  } catch (e) {
    const spinner = ora(`\nInitializing year ${year}...`).start();
    await fs.mkdir(yearDir);
    spinner.succeed(`Year ${year} initialized successfully!`);
  }

  try {
    await fs.stat(dayDir);
    colog.succ(`Day ${day} directory found!`);
  } catch (e) {
    const spinner = ora(`\nInitializing day ${day}...`).start();
    await fs.mkdir(dayDir);
    spinner.succeed(`Day ${day} initialized successfully!`);
  }

  // day.ts
  const dayFileSpinner = ora(`Creating day${day}.ts...`).start();
  await fs.copyFile(sourceFiles.solution, outputFiles.solution);
  dayFileSpinner.succeed(`day${day}.ts created successfully!`);
  exec(`code -r ${outputFiles.solution}`);

  // day.test.ts
  const testFileSpinner = ora(`Creating day${day}.test.ts...`).start();
  const testFileSrc = await fs.readFile(sourceFiles.test, "utf8");
  await fs.writeFile(
    outputFiles.test,
    testFileSrc.replace("day00", `day${day}`)
  );
  testFileSpinner.succeed(`day${day}.test.ts created successfully!`);
  exec(`code -r ${outputFiles.test}`);

  // test.txt
  const testInputSpinner = ora(`Checking test.txt...`).start();
  try {
    await fs.stat(outputFiles.testInput);
    testInputSpinner.succeed(`test.txt found!`);
  } catch (e) {
    testInputSpinner.text = "Creating test.txt...";
  }
  testInputSpinner.succeed(`test.txt created successfully!`);
  exec(`code -r ${outputFiles.testInput}`);

  // input.txt
  const inputSpinner = ora(`Fetching input...`).start();
  const input = await getInput(Number(day), Number(year));
  if (input) {
    inputSpinner.text = "Input found! Creating input.txt...";
    await fs.writeFile(outputFiles.input, input);
    inputSpinner.succeed(`input.txt created successfully!`);
    exec(`code -r ${outputFiles.input}`);
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
    exec(`code -r ${outputFiles.prob}`);
  } else {
    probSpinner.fail("Problem not found!");
  }

  colog.succ(`\nDay ${day} initialized successfully!`);

  const { ans1 } = await inquirer.prompt([
    {
      type: "input",
      name: "ans1",
      message: "Solution star 1 [Enter to skip]:",
    },
  ]);

  if (ans1) {
    const ans1Spinner = ora("Posting solution star 1...").start();
    await postSolution(Number(year), Number(day), 1, ans1);
    ans1Spinner.succeed("Solution star 1 posted successfully!");
  } else {
    colog.warn("Solution star 1 skipped!");
  }

  const { ans2 } = await inquirer.prompt([
    {
      type: "input",
      name: "ans2",
      message: "Solution star 2 [Enter to skip]:",
    },
  ]);

  if (ans2) {
    const ans2Spinner = ora("Posting solution star 2...").start();
    await postSolution(Number(year), Number(day), 2, ans2);
    ans2Spinner.succeed("Solution star 2 posted successfully!");
  } else {
    colog.warn("Solution star 2 skipped!");
  }
});

program.parse(process.argv);
