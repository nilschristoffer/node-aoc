import kleur from "kleur";
import fs from "fs/promises";
import { config as configEnv } from "dotenv";
import inquirer from "inquirer";

configEnv();

export const BASE_URL = "https://adventofcode.com";

export const getTimeToRelease = (day: number, year: number) => {
  const releaseDate = getReleaseDate(day, year);

  const today = new Date();

  return releaseDate.getTime() - today.getTime();
};

export const getReleaseDate = (day: number, year: number) => {
  return new Date(
    `${year}-12-${day.toString().padStart(2, "0")}T05:00:00.000Z`
  );
};

export const getDayUrl = (day: number, year: number) => {
  return `${BASE_URL}/${year}/day/${day}`;
};

export const timeToReadable = (d: number, h: number, m: number, s: number) => {
  return (
    (d !== 0 ? `${d}d ` : "") +
    (h !== 0 ? `${h}h ` : "") +
    (m !== 0 ? `${m}m ` : "") +
    (s !== 0 ? `${s}s ` : "")
  );
};

export const msToReadable = (ms: number) => {
  const msSecond = 1000;
  const msMinute = 60 * msSecond;
  const msHour = 60 * msMinute;
  const msDay = 24 * msHour;

  const d = Math.floor(ms / msDay);
  const h = Math.floor((ms - msDay * d) / msHour);
  const m = Math.floor((ms - msDay * d - msHour * h) / msMinute);
  const s = Math.floor((ms - msDay * d - msHour * h - msMinute * m) / msSecond);

  return timeToReadable(d, h, m, s);
};

export const handleErrors = (e: Error) => {
  if (e.message === "400" || e.message === "500") {
    console.log(e);
    console.log(
      kleur.red("INVALID SESSION KEY\n\n") +
        "Please make sure that the session key in the .env file is correct.\n" +
        "You can find your session key in the 'session' cookie at:\n" +
        "https://adventofcode.com\n\n" +
        kleur.bold("Restart the script after changing the .env file.\n")
    );
  } else if (e.message.startsWith("5")) {
    console.log(kleur.red("SERVER ERROR"));
  } else if (e.message === "404") {
    console.log(kleur.yellow("CHALLENGE NOT YET AVAILABLE"));
  } else {
    console.log(
      kleur.red(
        "UNEXPECTED ERROR\nPlease check your internet connection.\n\nIf you think it's a bug, create an issue on github.\nHere are some details to include:\n"
      )
    );
    console.log(e);
  }

  return "ERROR";
};

export const copyFile = async (
  src: string,
  dest: string,
  overwrite = false,
  modify = (res: string) => res
) => {
  try {
    await fs.stat(dest);
    colog.warn(`File ${dest} already exists!`);
    colog.warn(`Use --overwrite flag to overwrite it.`);
  } catch (e) {
    colog.default(`\nCopying ${src} to ${dest}...`);
    const sourceFile = await fs.readFile(src, "utf8");
    await fs.writeFile(dest, modify(sourceFile));
    colog.succ(`File ${dest} copied successfully!`);
  }
};

export const createFile = async (
  dest: string,
  content: string,
  overwrite = false
) => {
  try {
    await fs.stat(dest);
    if (!overwrite) {
      colog.warn(`File ${dest} already exists!`);
      colog.warn(`Use --overwrite flag to overwrite it.`);
      return;
    }
    throw new Error("File already exists");
  } catch (e) {
    colog.default(`\nCreating file ${dest}...`);
    fs.writeFile(dest, content);
    colog.succ(`File ${dest} created successfully!`);
  } finally {
  }
};

export const colog = {
  err: (msg: string) => console.log(kleur.red(msg)),
  succ: (msg: string) => console.log(kleur.green(msg)),
  warn: (msg: string) => console.log(kleur.yellow(msg)),
  default: (msg: string) => console.log(kleur.gray(msg)),
};

export const config = {
  SESSION_KEY: process.env.SESSION_KEY,
};

export const promptYear = async (): Promise<string> => {
  const { year } = await inquirer.prompt<{ year: string }>([
    {
      type: "number",
      name: "year",
      message: "Select year:",
      default: new Date().getFullYear(),
      validate: (input?: number) => {
        if (input && (input < 2015 || input > new Date().getFullYear())) {
          return `Year must be between 2015 and ${new Date().getFullYear()}`;
        }
        return true;
      },
    },
  ]);
  return year.toString();
};

export const promptDay = async (): Promise<string> => {
  const { day } = await inquirer.prompt<{ day: number }>([
    {
      type: "number",
      name: "day",
      message: "Select day [1-25]:",
      default: Math.min(25, new Date().getDate()),
      validate: (input?: number) => {
        if (input && (input < 1 || input > 25)) {
          return "Day must be between 1 and 25";
        }
        return true;
      },
    },
  ]);
  return day.toString().padStart(2, "0");
};

export const promptAnswer = async (args?: {
  message?: string;
}): Promise<string> => {
  const { ans } = await inquirer.prompt<{ ans: string }>([
    {
      type: "input",
      name: "ans",
      message: args?.message || "Select answer:",
    },
  ]);
  return ans;
};
