import kleur from "kleur";
import fs from "fs/promises";

export const BASE_URL = "https://adventofcode.com";

export const getTimeToRelease = (day, year) => {
  const releaseDate = getReleaseDate(day, year);

  const today = new Date();

  return releaseDate.getTime() - today.getTime();
};

export const getReleaseDate = (day, year) => {
  return new Date(
    `${year}-12-${day.toString().padStart(2, "0")}T05:00:00.000Z`
  );
};

export const getDayUrl = (day, year) => {
  return `${BASE_URL}/${year}/day/${Number(day)}`;
};

const timeToReadable = (d, h, m, s) => {
  return (
    (d !== 0 ? `${d}d ` : "") +
    (h !== 0 ? `${h}h ` : "") +
    (m !== 0 ? `${m}m ` : "") +
    (s !== 0 ? `${s}s ` : "")
  );
};

export const msToReadable = (ms) => {
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

export const handleErrors = (e) => {
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
  src,
  dest,
  overwrite = false,
  modify = (res) => res
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

export const createFile = async (dest, content, overwrite = false) => {
  try {
    await fs.stat(dest);
    if (!overwrite) {
      colog.warn(`File ${dest} already exists!`);
      colog.warn(`Use --overwrite flag to overwrite it.`);
      return;
    }
  } catch (e) {
  } finally {
    colog.default(`\nCreating file ${dest}...`);
    fs.writeFile(dest, content);
    colog.succ(`File ${dest} created successfully!`);
  }
};

export const colog = {
  err: (msg) => console.log(kleur.red(msg)),
  succ: (msg) => console.log(kleur.green(msg)),
  warn: (msg) => console.log(kleur.yellow(msg)),
  default: (msg) => console.log(kleur.gray(msg)),
};
