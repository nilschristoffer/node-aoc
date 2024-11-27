import { getDayUrl, handleErrors, config } from "./helpers/helpers.js";
import { JSDOM } from "jsdom";

export const getProblem = async (year, day) => {
  const url = getDayUrl(day, year);

  try {
    const response = await fetch(url, {
      headers: {
        cookie: `session=${config.SESSION_KEY}`,
      },
    });

    const body = await response.text();

    const $main = new JSDOM(body).window.document.querySelector("main");

    $main.style =
      "background-color: #0f0f23; color: lightgray; padding: 20px; margin: -20px; font-size: 12px; font-family: monospace";

    const style =
      '<style> code { background-color: #10101a; display: inline-block; border: "1px solid grey";} em { color: white; text-shadow: white 0 0 5px;}</style>';

    return `${style}${$main?.outerHTML}`;
  } catch (e) {
    return handleErrors(e);
  }
};
