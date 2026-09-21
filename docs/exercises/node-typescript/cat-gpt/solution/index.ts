import readline from 'readline-sync';
import { log } from "sloth-log";
import { repeatWords } from "./utils.ts";

let input: string = "";
do {
    input = readline.question("> ");
    if (input !== "bye") {
        let times: number = Math.floor(Math.random() * 10) + 1;
        let line : string = repeatWords("Meow", times, " ");
        let endChar: string = ["!", "?", "."][Math.floor(Math.random() * 3)];
        log(line + endChar, { speed: 1000, maxWordsAtOnce: 2 });
    }
} while (input !== "bye");

export { }