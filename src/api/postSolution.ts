import kleur from "kleur";
import {
  getDayUrl,
  getTimeToRelease,
  handleErrors,
  msToReadable,
  config,
  colog,
} from "./helpers/helpers";
import { JSDOM } from "jsdom";



export const postSolution = async (year: number, day: number, part: number, solution: string) => {
  const remainingMs = getTimeToRelease(day, year);

  if (remainingMs > 0) {
    colog.warn(`You have to wait: ${msToReadable(remainingMs)} before you can submit`);
    return Promise.resolve("ERROR");
  }

  const url = getDayUrl(day, year);

  return fetch(`${url}/answer`, {
    headers: {
      cookie: `session=${config.SESSION_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: `level=${part}&answer=${solution}`,
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(String(res.status));
      }

      return res.text();
    })
    .then((body) => {
      const $main = new JSDOM(body).window.document.querySelector("main");


      const info = $main?.textContent?.replace(/\[.*\]/, "")?.trim() ?? "Can't find the main element";

      if (info?.includes("That's the right answer")) {
        console.log(`Status`, kleur.green(`WOHOOHOO!! DAY ${day} PART ${part} SOLVED!`));
        colog.succ(`\n${info}\n`);
        return "SOLVED";
      } else if (info?.includes("That's not the right answer")) {
        console.log("Status:", kleur.red("WRONG ANSWER..."));
        colog.warn(`\n${info}\n`);
      } else if (info?.includes("You gave an answer too recently")) {
        console.log("Status:", kleur.red("TO SOON, PLZ WAIT"));
        colog.warn(`\n${info}\n`);
      } else if (
        info?.includes("You don't seem to be solving the right level")
      ) {
        console.log("Status:", kleur.yellow("HMM.. THIS LEVEL IS ALREADY COMPLETED or LOCKED"));
        colog.warn(`\n${info}\n`);
      } else {
        console.log("Status:", kleur.red("UNKNOWN RESPONSE\n"));
        colog.warn(`\n${info}\n`);
      }

      const waitStr = info?.match(
        /(one|two|three|four|five|six|seven|eight|nine|ten) (second|minute|hour|day)/
      );
      const waitNum = info?.match(/\d+\s*(s|m|h|d)/g);

      const waitVal = waitStr || waitNum;

      waitVal && colog.warn(`Next request possible in: ${waitVal.join(" ")}`);

      return "ERROR";
    })
    .catch(handleErrors);
};
