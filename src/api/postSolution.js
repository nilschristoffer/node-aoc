import kleur from "kleur";
import {
  getDayUrl,
  getTimeToRelease,
  handleErrors,
  msToReadable,
  config,
} from "./helpers/helpers.js";
import { JSDOM } from "jsdom";

const strToNum = (time) => {
  const entries = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };

  return entries[time] || NaN;
};

export const postSolution = async (year, day, part, solution) => {
  const remainingMs = getTimeToRelease(day, year);

  if (remainingMs > 0) {
    console.log(kleur.red(`You have to wait: ${msToReadable(remainingMs)}`));
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

      let status = "ERROR";

      const info =
        $main !== null
          ? $main.textContent.replace(/\[.*\]/, "").trim()
          : "Can't find the main element";

      if (info.includes("That's the right answer")) {
        console.log(`Status`, kleur.green(`DAY ${day} PART ${part} SOLVED!`));
        return "SOLVED";
      } else if (info.includes("That's not the right answer")) {
        console.log("Status:", kleur.red("WRONG ANSWER"));
        console.log(`\n${info}\n`);
        status = "WRONG";
      } else if (info.includes("You gave an answer too recently")) {
        console.log("Status:", kleur.red("TO SOON"));
      } else if (
        info.includes("You don't seem to be solving the right level")
      ) {
        console.log("Status:", kleur.yellow("ALREADY COMPLETED or LOCKED"));
      } else {
        console.log("Status:", kleur.red("UNKNOWN RESPONSE\n"));
        console.log(`\n${info}\n`);
      }

      const waitStr = info.match(
        /(one|two|three|four|five|six|seven|eight|nine|ten) (second|minute|hour|day)/
      );
      const waitNum = info.match(/\d+\s*(s|m|h|d)/g);

      if (waitStr !== null || waitNum !== null) {
        const waitTime = {
          s: 0,
          m: 0,
          h: 0,
          d: 0,
        };

        if (waitStr !== null) {
          const [, time, unit] = waitStr;
          waitTime[unit[0]] = strToNum(time);
        } else if (waitNum !== null) {
          waitNum.forEach((x) => {
            waitTime[x.slice(-1)] = Number(x.slice(0, -1));
          });
        }

        const delayStr = msToReadable(
          waitTime.d,
          waitTime.h,
          waitTime.m,
          waitTime.s
        );

        console.log(`Next request possible in: ${delayStr}`);
      }

      return status;
    })
    .catch(handleErrors);
};
