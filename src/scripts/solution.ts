import { postSolution } from "../api/postSolution";
import { colog, promptDay, promptYear } from "../api/helpers/helpers";
import { program } from "commander";
import inquirer from "inquirer";
import ora from "ora";

program.version("1.0.0").description("Post solution for a specific day");

program.action(async () => {
  const year = await promptYear();
  const day = await promptDay();
  const { part, ans } = await inquirer.prompt([
    {
      type: "select",
      name: "part",
      choices: [
        { name: "*", value: "1" },
        { name: "**", value: "2" },
      ],
      message: "Select part:",
      default: "1",
    },
    {
      type: "input",
      name: "ans",
      message: "Select answer:",
      default: "",
      validate: (input: string) => {
        if (!input?.length) {
          return "Answer cannot be empty";
        }
        return true;
      },
    },
  ]);

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
