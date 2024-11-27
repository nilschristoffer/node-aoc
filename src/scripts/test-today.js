import { exec } from "child_process";

const thisYear = new Date().getFullYear();
const day = new Date().getDate();

const pattern = `${thisYear}/day${day.toString().padStart(2, "0")}`;

exec(`jest --watchAll --testPathPattern=${pattern}`);
