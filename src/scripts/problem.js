import promptSync from "prompt-sync";
import { getProblem } from "../api/getProblem.js";
import { defaultYear } from "../env.js";

const [fDay] = process.argv.slice(2);

const prompt = promptSync({ sigint: true });

const day = fDay ?? prompt("Which day: ");

getProblem(defaultYear, day);
