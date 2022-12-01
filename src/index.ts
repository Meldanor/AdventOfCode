import { run as day1 } from './01/day.js';

const day = Number.parseInt(process.argv[2]);
const args = process.argv.slice(3);
console.log(`Running day ${day} with arguments ${args}`);

switch (day) {
  case 1:
    await day1(args);
    break;
  default:
    console.warn('Not yet implemented');
}
