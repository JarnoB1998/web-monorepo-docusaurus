import readline from 'readline-sync';

let points : number[] = [];
let running : boolean = true;

do {
    let input : string = readline.question(`Geef de punten van student ${points.length + 1} in: `);
    if (input === '') {
        running = false;
    } else {
        points.push(parseInt(input));
    }
} while (running);

let sum : number = 0;
let failed : number = 0;
for (let point of points) {
    sum += point;
    if (point < 10) {
        failed++;
    }
}

console.log(`Het gemiddelde van de punten is ${Math.round(sum / points.length)}`);
console.log(`Het aantal studenten met een onvoldoende is ${failed}`);

export {}
