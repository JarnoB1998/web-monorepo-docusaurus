import readline from 'readline-sync';

// We gaan in deze oefening een programma maken dat een tekst moet tonen in een text-box. De gebruiker zal een tekst moeten ingeven en de applicatie zal vervolgens de tekst tonen in een text-box. Hij zal de gebruiker blijven vragen om een tekst in te geven tot de gebruiker een lege tekst ingeeft.

// Je kan dit doen door gebruik te maken van de `console.log` functie en de `repeat` functie van een string.

// #### Voorbeeld interactie

// ```bash
// Geef de tekst in: Hello World
// +-------------+
// | Hello World |
// +-------------+
// Geef de tekst in: Hey broer
// +-----------+
// | Hey broer |
// +-----------+
// Geef de tekst in: 
// Tot ziens!
// ```

let running : boolean = true;
do {
    const text : string = readline.question('Geef de tekst in: ');
    if (text === '') {
        running = false;
    } else {
        console.log(`+${'-'.repeat(text.length + 2)}+`);
        console.log(`| ${text} |`);
        console.log(`+${'-'.repeat(text.length + 2)}+`);
    }
} while (running);

console.log('Tot ziens!');

export {}
