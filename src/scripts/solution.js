import promptSync from "prompt-sync";
import { postSolution } from "../api/postSolution.js";
import { colog } from "../api/helpers/helpers.js";

const [fYear, fDay, fPart, fAns] = process.argv.slice(2);

const prompt = promptSync({ sigint: true });

const year = (fYear ?? prompt("Year: ")) || new Date().getFullYear();
colog.default(year);

const day = (fDay ?? prompt("Day: ")) || new Date().getDate().toString();
colog.default(day);

const part = (fPart ?? prompt("Part: ")) || "1";
colog.default(part);

const answer = fAns ?? prompt("Answer: ");
colog.default(answer);

if (answer) {
  postSolution(year, day, part, answer);
} else {
  colog.warn("No answer provided, exiting...");
}
