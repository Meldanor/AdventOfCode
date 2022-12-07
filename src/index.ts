import { run as day1 } from './01/day.js';
import { run as day2 } from './02/day.js';
import { run as day3 } from './03/day.js';
import { run as day4 } from './04/day.js';
import { run as day5 } from './05/day.js';
import { run as day6 } from './06/day.js';
import { run as day7 } from './07/day.js';

const day = Number.parseInt(process.argv[2]);
const args = process.argv.slice(3);
console.log(`Running day ${day} with arguments ${args}`);

switch (day) {
  case 1:
    await day1(args);
    break;
  case 2:
    await day2(args);
    break;
  case 3:
    await day3(args);
    break;
  case 4:
    await day4(args);
    break;
  case 5:
    await day5(args);
    break;
  case 6:
    await day6(args);
    break;
  case 7:
    await day7(args);
    break;
  default:
    console.warn('Not yet implemented');
}
