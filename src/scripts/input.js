import promptSync from "prompt-sync";
import { getInput } from "../api/getInput.js";

const [fDay] = process.argv.slice(2);

const prompt = promptSync({ sigint: true });

const day = fDay ?? prompt("Which day? (0 = today) ");

const todaysDate = new Date().getDate();

getInput(day || todaysDate);
