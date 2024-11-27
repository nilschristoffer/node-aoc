import { sessionKey } from "../env.js";
import { getDayUrl, handleErrors } from "./helpers/helpers.js";
import { JSDOM } from "jsdom";

export const getProblem = async (year, day) => {
  const url = getDayUrl(day, year);

  try {
    const response = await fetch(url, {
      headers: {
        cookie: `session=${sessionKey}`,
      },
    });

    const body = await response.text();

    const $main = new JSDOM(body).window.document.querySelector("main");

    return $main?.outerHTML;
  } catch (e) {
    return handleErrors(e);
  }
};
