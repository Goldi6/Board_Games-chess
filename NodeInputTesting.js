const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// rl.question("What is your Age?", (answer) => {
//     console.log(`Oh, so your age is ${answer}`);
//     console.log("closing the interface...");
//     rl.close();
// });

const ac = new AbortController();
const signal = ac.signal;

// rl.question("What is your name?", { signal }, (answer) => {
//     console.log(`Oh, so your name is ${answer}`);
//     console.log("closing the interface...");
//     process.exit();
// });

// signal.addEventListener(
//     "abort",
//     () => {
//         console.log("the name question timed out!");
//     }, { once: true }
// );

// setTimeout(() => {
//     ac.abort();
//     process.exit();
// }, 10000);

const prompt = require("prompt-sync")();

const input = prompt("What is your name? ");

console.log(`Oh, so your name is ${input}`);