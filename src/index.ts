import { run as day1 } from './01/day';

const day = Number.parseInt(process.argv[2]);
console.log(`Running day ${day}`);
const args = process.argv.slice(3);

switch (day) {
  case 1:
    day1(args);
    break;
  default:
    console.warn('Not yet implemented');
}
