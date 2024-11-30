import { getDayUrl, handleErrors, config } from "./helpers/helpers";
import { JSDOM } from "jsdom";

export const getProblem = async (year: number, day: number) => {
  const url = getDayUrl(day, year);

  try {
    const response = await fetch(url, {
      headers: {
        cookie: `session=${config.SESSION_KEY}`,
      },
    });

    const body = await response.text();

    const $main = new JSDOM(body).window.document.querySelector("main");

    if (!$main) {
      return null;
    }

    $main.style.backgroundColor = "#0f0f23";
    $main.style.color = "lightgray";
    $main.style.padding = "20px";
    $main.style.margin = "-20px";
    $main.style.fontSize = "12px";
    $main.style.fontFamily = "monospace";
    const style =
      '<style> code { background-color: #10101a; display: inline-block; border: "1px solid grey";} em { color: white; text-shadow: white 0 0 5px;}</style>';

    return `${style}${$main?.outerHTML}`;
  } catch (e: Error | any) {
    return "";
  }
};
