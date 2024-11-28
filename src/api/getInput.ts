import kleur from "kleur";
import {
  getDayUrl,
  getReleaseDate,
  getTimeToRelease,
  handleErrors,
  colog,
  config,
} from "./helpers/helpers";
import PromptSync from "prompt-sync";

const prompt = PromptSync({ sigint: true });

export const getInput = async (
  day: number,
  year = new Date().getFullYear()
) => {
  const timeToRelease = getTimeToRelease(day, year);
  if (timeToRelease > 0) {
    const releaseDate = getReleaseDate(day, year);
    colog.err(
      `CHALLANGE NOT YET AVAILABLE UNTIL ${releaseDate.toLocaleString()}`
    );

    const ans = prompt(
      kleur.yellow(
        `Do you want to fetch automatically in ${
          timeToRelease / 1000
        } seconds? [y/n] `
      )
    );
    if (ans !== "y") {
      colog.warn("Please fetch manually later!");
      return;
    }

    colog.succ(
      `Fetching input in ${Math.floor(
        timeToRelease / 1000
      )} seconds for day ${day} of year ${year}`
    );

    let res;
    setTimeout(() => {
      res = getInput(day, year);
    }, timeToRelease);
    return res;
  }

  const url = getDayUrl(day, year);
  const inputUrl = `${url}/input`;

  try {
    const result = await fetch(inputUrl, {
      headers: {
        cookie: `session=${config.SESSION_KEY}`,
      },
    });

    if (result.status !== 200) {
      throw new Error(String(result.status));
    }

    const res = await result.text();

    return res.replace(/\n$/, "");
  } catch (e: Error | any) {
    handleErrors(e);
  }
};
