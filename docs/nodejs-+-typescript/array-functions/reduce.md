# Array.reduce()

De reduce-functie is waarschijnlijk de meest krachtige, maar ook de meest intimiderende array-methode in TypeScript. Zie het als het Zwitserse zakmes: je kunt er bijna alles mee bouwen (van een simpele optelsom tot een compleet geavanceerd object), mits je weet hoe je het gereedschap moet vasthouden.

De functie verwacht een callback-functie en (optioneel) een initiële waarde. 

```tsx
array.reduce((accumulator, currentValue) => {
    // return newAccumulator
}, initialValue);
```

De parameters uitgelegd:
- `accumulator`: Dit is de waarde die je telkens doorgeeft aan de volgende stap. Hierin "verzamel" je het eindresultaat.
- `currentValue` (het huidige item): Het element uit de array waar de functie op dat moment naar kijkt.
 - `initialValue` (de startwaarde): Dit is de waarde waar de accumulator mee begint.

De return waarde van de functie bepaalt wat de nieuwe waarde van de accumulator zal worden. Dit is meestal gebaseerd op de huidige `accumulator` en de `currentValue`.

Dit is natuurlijk allemaal vrij technisch, dus zullen we nu kijken wat je er dan concreet hiermee kan doen.

## Optelsom

Een van de meest voorkomende voorbeelden is het bepalen van de som van een array van getallen. Je zou dit kunnen doen aan de hand van een for-lus. We gebruiken hier bewust de terminologie van reduce om de argumenten te verduidelijken. We korten `accumulator` vaak af als `acc` en `currentValue` als `curr`:

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];
let acc: number = 0; // Dit is de initialValue

for (let curr of numbers) {
    acc = acc + curr;
}

let sum: number = curr;
```

Je ziet hier dat de accumulator eerst op een `initialValue` van 0 wordt gezet. Vervolgens wordt voor elk element van de array een berekening uitgevoerd `(acc + curr)` en wordt de uitkomst toegewezen als de nieuwe waarde van de accumulator. Dit herhaalt zich tot er geen elementen meer in de array over zijn.

Nu kan je gemakkelijk deze logica omzetten naar een `reduce` functie: 

import InteractiveReduce from '@site/src/components/InteractiveReduce';

<InteractiveReduce />

## Frequentie Couting

Stel dat we een array van letters hebben we zouden graag weten hoeveel keer elke letter in deze array voorkomt dan zouden we dit op de volgende manier kunnen doen aan de hand van een for-loop:

```typescript
const letters: string[] = ['a', 'b', 'a', 'c', 'b', 'a', 'd', 'c', 'b', 'd'];

let acc: Record<string, number> = {};

for (let curr of letters) {
    acc[curr] = (acc[curr] ?? 0) + 1
}

let freq: Record<string, number> = acc;
```

Uiteraard proberen we in moderne typescript code zo weinig mogelijk for lussen te gebruiken voor dit soort constructies. We gebruiken dus weer een `reduce` om dit probleem op te lossen:

import InteractiveReduceFreq from '@site/src/components/InteractiveReduceFreq';

<InteractiveReduceFreq />

Merk op dat we nu het type van de accumulator moeten opgeven `Record<string, number>` anders kan TypeScript het type van `{}` niet afleiden.

## GroupBy

Stel dat we een lijst van objecten hebben:

```typescript
const employees : Employee[] = [
  { name: "Alice", dept: "IT" },
  { name: "Bob", dept: "HR" },
  { name: "Eve", dept: "IT" },
];
```

En we zouden graag een overzicht willen hebben van alle departementen met de namen mensen die er werken. We willen eigenlijk een object dat er als volgt uit ziet:

```typescript
{
    "IT": ["Alice","Eve"]
    "HR": ["Bob]
}
```

Dus eigenlijk van het type `Record<string, string[]`>`

We zouden dit weer als een `for` lus schrijven: 

```typescript
const employees : Employee[] = [
  { name: "Alice", dept: "IT" },
  { name: "Bob", dept: "HR" },
  { name: "Eve", dept: "IT" },
];

let acc: Record<string, string[]> = {};

for (let curr of employees) {
    if (acc[curr.dept]) {
        acc[curr.dept].push(curr.name);
    } else {
        acc[curr.dept] = [curr.name];
    }
    
}
```

of nog korter: 

```typescript
for (const curr of employees) {
    (acc[curr.dept] ??= []).push(curr.name);
}
```

De `??=` operator noemt men de Nullish Assignment operator en deze geeft een waarde aan een bepaalde variabele enkel alleen maar als deze op dat moment undefined is. 

Als we dit dan zouden schrijven als een `reduce` functie krijgen we dit.


import InteractiveReduceGroupBy from '@site/src/components/InteractiveReduceGroupBy';

<InteractiveReduceGroupBy />

## Maximale waarde vinden

In TypeScript heb je een `Math.max` functie waar je het maximum van een rij getallen kan bepalen.

```typescript
let numbers: number[] = [1,5,3,2,5,6];

Math.max(...numbers); // 6
```

Maar als voorbeeld zullen we deze functie ook eens uitwerken met een reduce. In dit geval is het interessant om geen `initialValue` mee te geven, want die weten we niet op voorhand. Hij neemt dan het eerste element als startpunt van de accumulator.

import InteractiveReduceMax from '@site/src/components/InteractiveReduceMax';

<InteractiveReduceMax />

## Duplicaten verwijderen

import InteractiveReduceUnique from '@site/src/components/InteractiveReduceUnique';

<InteractiveReduceUnique />

import Quiz from '@site/src/components/Quiz';

## Test je kennis

<Quiz url="/quizzes/reduce.json" />
