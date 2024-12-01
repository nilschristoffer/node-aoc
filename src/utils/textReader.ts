import { readFileSync } from "fs";

const DEFAULT_YEAR = process.env.DEFAULT_YEAR;

type TextReader<T> = (day: number, fileName: string, year?: number) => T;

export const textReader: TextReader<string> = (
  day,
  fileName,
  year = Number(DEFAULT_YEAR)
) => {
  try {
    const path = `${__dirname}/../solutions/${year}/day${day
      .toString()
      .padStart(2, "0")}/${fileName}.txt`;
    return readFileSync(path, "utf-8").toString();
  } catch (error) {
    console.warn(`Error reading file for day ${day} and fileName ${fileName}`);
    return "";
  }
};

export const textReaderArr: TextReader<string[]> = (day, fileName, year) => {
  const text = textReader(day, fileName, year);
  return text ? text.split("\n") : [];
};

export const textReaderArrNumb: TextReader<number[]> = (day, fileName, year) =>
  textReaderArr(day, fileName, year).map((item) => parseInt(item));
