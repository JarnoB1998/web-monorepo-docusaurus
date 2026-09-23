import readline from 'readline-sync';
import * as cowsay from "cowsay"

function say(text: string) {
    if (text === "Meow!") {
        throw new Error("Cows don't meow!");
    }
    let output: string = cowsay.say({ text });
    console.log(output);
}

let message : string = "";
do {
    try {
        message = readline.question("What should the cow say? ");
        if (message !== "exit") {
            say(message);
        }
    } catch (e: any) {
        console.log(e.message)
    }
} while (message !== "exit");





export {}
