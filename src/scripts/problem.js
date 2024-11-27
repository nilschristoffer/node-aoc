import promptSync from "prompt-sync";
import { getProblem } from "../api/getProblem.js";

const [fDay] = process.argv.slice(2);

const prompt = promptSync({ sigint: true });

const day = fDay ?? prompt("Which day: ");

getProblem(new Date().getFullYear(), day);
