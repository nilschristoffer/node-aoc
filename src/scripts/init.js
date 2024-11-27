import fs from "fs";
import path from "path";
import url from "url";

import { getInput } from "../api/getInput.js";
import { getProblem } from "../api/getProblem.js";
import { copyFile, createFile, colog } from "../api/helpers/helpers.js";
import PromptSync from "prompt-sync";
import { postSolution } from "../api/postSolution.js";
import { exec } from "child_process";

const prompt = PromptSync({ sigint: true });

const day = (process.argv[2] || new Date().getDate())
  .toString()
  .padStart(2, "0");
const year = process.argv[3] || new Date().getFullYear();

(async () => {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
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

  if (!fs.existsSync(yearDir)) {
    colog.default(`\nCreating dir ${year}...`);
    fs.mkdirSync(yearDir);
    colog.succ(`Dir ${year} created successfully!`);
  }

  if (!fs.existsSync(dayDir)) {
    colog.default(`\nCreating dir day${day}...`);
    fs.mkdirSync(dayDir);
    colog.succ(`Dir day${day} created successfully!`);
  } else {
    colog.default(`Dir day${day} already exists...`);
  }

  // day.ts
  await copyFile(sourceFiles.solution, outputFiles.solution);
  exec(`code -r ${outputFiles.solution}`);

  // day.test.ts
  await copyFile(sourceFiles.test, outputFiles.test, false, (res) =>
    res.replace("day00", `day${day}`)
  );
  exec(`code -r ${outputFiles.test}`);

  // test.txt
  await createFile(outputFiles.testInput, "");
  exec(`code -r ${outputFiles.testInput}`);

  // input.txt
  const input = await getInput(Number(day), year);
  if (input) {
    await createFile(outputFiles.input, input);
    exec(`code -r ${outputFiles.input}`);
  }

  // problem.html
  const prob = await getProblem(year, parseInt(day));
  if (prob) {
    await createFile(outputFiles.prob, prob, true);
    exec(`code -r ${outputFiles.prob}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  colog.succ(`\nDay ${day} initialized successfully!`);

  const ans1 = prompt("\nSolution star 1 [Enter to skip]:\n");

  if (ans1) {
    await postSolution(year, day, 1, ans1);
  } else {
    colog.warn("Solution star 1 skipped!");
  }

  const ans2 = prompt("\nSolution star 2 [Enter to skip]:\n");
  if (ans2) {
    await postSolution(year, day, 2, ans2);
  } else {
    colog.warn("Solution star 2 skipped!");
  }
})();
