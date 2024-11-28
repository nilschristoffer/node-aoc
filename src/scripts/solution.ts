import { postSolution } from "../api/postSolution";
import { colog } from "../api/helpers/helpers";
import { program } from "commander";
import inquirer from "inquirer";
import ora from "ora";

program.version("1.0.0").description("Post solution for a specific day");

program.action(async () => {
  let { year, day, part, ans } = await inquirer.prompt([
    {
      type: "input",
      name: "year",
      message: "Select year:",
      default: new Date().getFullYear().toString(),
    },
    {
      type: "input",
      name: "day",
      message: "Select day:",
      default: new Date().getDate().toString(),
    },
    {
      type: "select",
      name: "part",
      choices: ["1", "2"],
      message: "Select part:",
      default: "1",
    },
    {
      type: "input",
      name: "ans",
      message: "Select answer:",
      default: "",
    },
  ]);

  day = day.padStart(2, "0");

  if (!ans) {
    process.exit(0);
  }

  const ansSpinner = ora("Posting solution...").start();
  const { res, info } = await postSolution(
    Number(year),
    Number(day),
    Number(part),
    ans
  );
  switch (res) {
    case "SOLVED":
      ansSpinner.succeed("Solution solved successfully!");
      info && colog.succ(info);
      break;
    case "WAIT":
      ansSpinner.warn("You have to wait!");
      info && colog.warn(info);
      break;
    default:
      ansSpinner.fail("Solution was not solved!");
      info && colog.err(info);
      break;
  }
});

program.parse(process.argv);
