import { readInput } from './utils.js';

const year = Number.parseInt(process.argv[2]);
const day = Number.parseInt(process.argv[3]);
const dayAsString = day < 10 ? `0${day}` : day.toString();
const content = await readInput(`src/${year}/${dayAsString}/input.txt`);
const dayFunc = (await import(`./${year}/${dayAsString}/day.js`)).run;
console.log(`Running  ${year}-${dayAsString}`);

dayFunc(content);
