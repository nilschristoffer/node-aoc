import {
  getDayUrl,
  getTimeToRelease,
  handleErrors,
  msToReadable,
  config,
} from "./helpers/helpers";
import { JSDOM } from "jsdom";

export type SolutionResult = "SOLVED" | "ERROR" | "WRONG" | "WAIT";

export const postSolution = async (
  year: number,
  day: number,
  part: number,
  solution: string
): Promise<{ res: SolutionResult; info?: string }> => {
  try {
    const remainingMs = getTimeToRelease(day, year);

    if (remainingMs > 0) {
      return {
        res: "WAIT",
        info: `You have to wait: ${msToReadable(
          remainingMs
        )} before you can submit`,
      };
    }

    const url = getDayUrl(day, year);

    const response = await fetch(`${url}/answer`, {
      headers: {
        cookie: `session=${config.SESSION_KEY}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: `level=${part}&answer=${solution}`,
    });

    if (!response.ok) {
      return {
        res: "ERROR",
        info: `HTTP error! status: ${response.status}`,
      };
    }

    const body = await response.text();
    const $main = new JSDOM(body).window.document.querySelector("main");

    if (!$main) {
      return {
        res: "ERROR",
        info: "Could not find main element",
      };
    }

    const info =
      $main.textContent?.replace(/\[.*\]/, "")?.trim() ??
      "Can't find the main element";

    if (info.includes("That's the right answer")) {
      return {
        res: "SOLVED",
        info,
      };
    } else if (info.includes("That's not the right answer")) {
      return {
        res: "WRONG",
        info,
      };
    } else {
      return {
        res: "ERROR",
        info,
      };
    }
  } catch (error: Error | any) {
    return {
      res: "ERROR",
      info: error.message,
    };
  }
};
