import promptSync from "prompt-sync";
import { postSolution } from "../api/postSolution";
import { colog } from "../api/helpers/helpers";

const [fYear, fDay, fPart, fAns] = process.argv.slice(2);

const prompt = promptSync({ sigint: true });

const year = (fYear ?? prompt("Year: ")) || new Date().getFullYear();
colog.default(year.toString());

const day = (fDay ?? prompt("Day: ")) || new Date().getDate().toString();
colog.default(day);

const part = (fPart ?? prompt("Part: ")) || "1";
colog.default(part);

const answer = fAns ?? prompt("Answer: ");
colog.default(answer);

if (answer) {
  postSolution(Number(year), Number(day), Number(part), answer);
} else {
  colog.warn("No answer provided, exiting...");
}
