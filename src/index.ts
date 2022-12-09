const day = Number.parseInt(process.argv[2]);
const args = process.argv.slice(3);
console.log(`Running day ${day} with arguments ${args}`);
const dayAsString = day <= 10 ? `0${day}` : day.toString();
const dayFunc = (await import(`./${dayAsString}/day.js`)).run;
dayFunc(args);
