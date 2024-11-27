import promptSync from "prompt-sync";
import { postSolution } from "../api/postSolution.js";

const [fDay, fPart, fAns] = process.argv.slice(2);

const prompt = promptSync({ sigint: true });

const day = fDay ?? prompt("Which day: ");
const part = fPart ?? prompt("Which part: ");
const answer = fAns ?? prompt("Your answer: ");

postSolution(new Date().getFullYear(), day, part, answer);
