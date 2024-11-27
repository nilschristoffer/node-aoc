import kleur from "kleur";
import {
  getDayUrl,
  getReleaseDate,
  getTimeToRelease,
  handleErrors,
  colog,
} from "./helpers/helpers.js";
import PromptSync from "prompt-sync";
import { defaultYear, sessionKey } from "../env.js";

const prompt = PromptSync({ sigint: true });

export const getInput = async (day, year = defaultYear) => {
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
      colog.warn("Please fetch manually late!");
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

  return fetch(inputUrl, {
    headers: {
      cookie: `session=${sessionKey}`,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(String(res.status));
      }

      return res.text();
    })
    .then((body) => {
      return body.replace(/\n$/, "");
    })
    .catch(handleErrors);
};
