import readline from 'readline-sync';

const amount : number = readline.questionFloat("Geef het bedrag in: ");
const interest : number = readline.questionFloat("Geef het interest percentage in: ");

const amountAfterOneYear : number = Math.round(amount * (1 + interest / 100) * 100) / 100;
const amountAfterTwoYears : number = Math.round(amount * (1 + interest / 100) ** 2 * 100) / 100;
const amountAfterFiveYears : number = Math.round(amount * (1 + interest / 100) ** 5 * 100) / 100;

console.log(`Na 1 jaar heb je ${amountAfterOneYear}`);
console.log(`Na 2 jaar heb je ${amountAfterTwoYears}`);
console.log(`Na 5 jaar heb je ${amountAfterFiveYears}`);

export {}
