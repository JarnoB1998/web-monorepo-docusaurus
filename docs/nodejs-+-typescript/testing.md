# Testing

Testen van applicaties gebeurt op verschillende niveaus. Hoewel niet iedereen dezelfde niveaus van elkaar onderscheidt, maakt men in het algemeen een onderscheid tussen **unit testing** en **end-to-end testing**.

Unit testing omvat het testen van individuele onderdelen van de code, zoals functies of methoden. Meestal wordt hier een white-box principe gehanteerd: de tester kent de inhoud van de unit en mag code schrijven die gebruik maakt van deze kennis. Typische frameworks voor unit testing van Node.js- en Express-applicaties zijn Mocha en Vitest.

End-to-end testing omvat het testen "zoals een gebruiker". Deze vorm volgt het black-box principe. In essentie omvat dit het automatiseren van volledige browserinteracties. Typische frameworks zijn Cypress of Selenium.

## Waarom testen?

De belangrijkste reden om te testen is natuurlijk om te controleren of je code werkt en bugvrij is. Maar in de praktijk is testen nog veel belangrijker om de **betrouwbaarheid** in de toekomst te garanderen.

* **Voorkomen van nieuwe fouten:** Software verandert heel de tijd. Soms voeg je een nieuwe functie toe en breek je onbedoeld iets dat al werkte. Met goede tests ontdek je zo'n fout meteen.
* **Samenwerken in een team:** Je werkt bijna altijd samen met anderen aan hetzelfde project. Tests dienen als een veiligheidsnet: als iemand anders (of jijzelf) een fout maakt in een gedeelde module, zal de test direct aangeven dat er iets mis is.
* **Automatisch controleren:** Bij professionele projecten worden tests automatisch uitgevoerd zodra je code opslaat in Git (bijvoorbeeld bij een 'push' naar de main branch of bij het mergen van een merge request). Zo voorkom je dat er foutieve code in je project terechtkomt.
* **Hulp bij AI:** Tests zijn ook essentieel als je AI-tools gebruikt om code te schrijven. De AI kan de tests namelijk zelf draaien om te controleren of zijn eigen code correct is. Als de tests falen, kan de AI direct zelf op zoek gaan naar een oplossing of de code aanpassen totdat alles wel werkt.

Testen is dus niet alleen om te zien of je code *nu* werkt, maar vooral om er zeker van te zijn dat je code *altijd* blijft werken, hoe groot of complex het project ook wordt.

## Vitest

[Vitest](https://vitest.dev/guide/) is een testframework voor JavaScript en TypeScript. Het is een test runner die compatibel is met de Jest-API en gebruik maakt van **Vite** om code te verwerken en modules te laden. Daardoor kan je tests schrijven met de vertrouwde functies `test`, `describe` en `expect` en dezelfde veelgebruikte testmethodes als in Jest. Veel bestaande Jest-tests kunnen met beperkte aanpassingen overgenomen worden; er zijn wel [verschillen bij het overstappen](https://vitest.dev/guide/migration/jest).

Vitest bevat zowel de test runner, die de tests uitvoert, als een assertion library, waarmee je controleert of resultaten aan je verwachtingen voldoen. Het ondersteunt TypeScript rechtstreeks en kan ook gebruikt worden in een Node.js-project zonder bestaande Vite-configuratie.

### Installatie

Om Vitest in je project te installeren, voer je volgend commando uit:

```bash
npm i --save-dev vitest
```

### Configuratie

Voor de voorbeelden in dit hoofdstuk heb je geen apart configuratiebestand nodig. Vitest kan `.ts`-bestanden rechtstreeks uitvoeren en levert zelf de types voor zijn testfuncties. Het uitvoeren van tests controleert niet automatisch alle TypeScript-types; daarvoor kan je apart `npx tsc --noEmit` gebruiken.

Voeg het volgende script toe aan het `scripts`-object in je `package.json` en behoud eventuele andere scripts:

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

Met `npm test` voer je alle tests één keer uit.

Vitest herkent testbestanden zoals `area.test.ts` en `area.spec.ts` automatisch. In elk testbestand importeer je de gebruikte testfuncties, zoals `test`, `expect` en eventueel `describe`, uit `vitest`.

## Testen van modules

Een heel belangrijke reden om modules te gebruiken is dat je deze modules eenvoudig kan testen. Als je al je code in één bestand zet dan is het moeilijk om deze code te testen. Je kan dan niet gemakkelijk bepaalde functies isoleren en testen. Door gebruik te maken van modules kan je deze functies isoleren en testen. Het testen van functies in modules noemen we ook vaak unit testing. Dit is een manier van testen waarbij je individuele functies test in plaats van het hele programma.


### Testen van functies in modules

We gaan terug naar het voorbeeld van de `areaRectangle` functie uit het module hoofdstuk. Deze functie berekent de oppervlakte van een rechthoek. We hebben deze functie in een module gezet met de naam `area.ts`. De inhoud van dit bestand is als volgt:

```typescript
export function areaRectangle(l: number, w: number): number {
    return l * w;
}
```

Stel dat je de functie `areaRectangle` wil testen. Je kan dan een nieuw bestand aanmaken met de naam `area.test.ts`. In dit bestand kan je de functie importeren en vervolgens testen.

```typescript
import { expect, test } from 'vitest';
import { areaRectangle } from './area';

test('areaRectangle should return the correct area of a rectangle', () => {
    expect(areaRectangle(2, 3)).toBe(6);
    expect(areaRectangle(5, 10)).toBe(50);
});
```

Nu kan je deze test laten lopen door het volgende commando uit te voeren:

```bash
npm test
```

De andere functies kan je op dezelfde manier testen.

```typescript
import { expect, test } from 'vitest';
import { areaCircle, areaSquare } from './area';

test('areaCircle should return the correct area of a circle', () => {
    expect(areaCircle(2)).toBeCloseTo(12.566370614359172);
    expect(areaCircle(5)).toBeCloseTo(78.53981633974483);
});

test('areaSquare should return the correct area of a square', () => {
    expect(areaSquare(2)).toBe(4);
    expect(areaSquare(5)).toBe(25);
});
```

Je merkt op dat we hier gebruik maken van `toBeCloseTo` in plaats van `toBe` omdat we te maken hebben met decimalen en deze kunnen soms een beetje afwijken door de manier waarop computers met decimalen omgaan. De reden hiervoor is dat computers decimalen opslaan in een binair formaat, wat kan leiden tot kleine afrondingsfouten. Hierdoor kunnen twee decimalen die in theorie gelijk zouden moeten zijn, in de praktijk net iets van elkaar verschillen. `toBeCloseTo` houdt rekening met deze kleine verschillen en controleert of de waarden binnen een bepaald bereik van elkaar liggen, in plaats van exact gelijk te zijn.

#### Describe blocks

Je kan ook gebruik maken van `describe` blocks om je tests te organiseren. Dit is vooral handig als je veel tests hebt voor dezelfde module of functie. Als we bijvoorbeeld willen nagaan hoe de `areaRectangle` functie zich gedraagt bij negatieve inputs, kunnen we een `describe` block gebruiken om deze tests te groeperen.

```typescript
import { describe, expect, test } from 'vitest';
import { areaRectangle } from './area';

describe('areaRectangle', () => {
    test('should return the correct area of a rectangle', () => {
        expect(areaRectangle(2, 3)).toBe(6);
        expect(areaRectangle(5, 10)).toBe(50);
    });

    test('should return 0 if one of the sides is 0', () => {
        expect(areaRectangle(0, 3)).toBe(0);
        expect(areaRectangle(5, 0)).toBe(0);
    });

    test('should return a negative area if exactly one of the sides is negative', () => {
        expect(areaRectangle(-2, 3)).toBe(-6);
        expect(areaRectangle(5, -10)).toBe(-50);
    });
});
```

#### Testen van asynchrone functies

Ook in tests kan je gebruik maken van async en await. Je kan de test functie async maken en dan de await keyword gebruiken om te wachten tot de Promise is afgerond. In de volgende voorbeelden gaan we ervan uit dat de asynchrone functies `multiply` en `divide` uit je eigen module geïmporteerd zijn.

```typescript
import { expect, test } from 'vitest';

test("multiply should return the product of two numbers", async () => {
    const result = await multiply(2, 3);
    expect(result).toBe(6);
});
```

Om te testen of een Promise wordt afgewezen met een fout, gebruik je `rejects.toThrow`. Vergeet de `await` niet: de test moet wachten totdat de controle klaar is.

```typescript
import { expect, test } from 'vitest';

test("divide should throw an error when dividing by zero", async () => {
    await expect(divide(10, 0)).rejects.toThrow("Cannot divide by zero");
});
```

Als `divide` geen fout oplevert, faalt deze test ook. Bij een test met alleen controles in een `catch`-blok zouden die controles in dat geval nooit uitgevoerd worden.

##### Voorbeeld

Het is nu mogelijk om complexe logica te schrijven zonder dat je code totaal onleesbaar wordt. Stel je voor dat je twee getallen wil uitlezen uit een bestand `getal1.txt` en `getal2.txt`. Vervolgens wil je een vermenigvuldiging uitvoeren en het resultaat wegschrijven naar een bestand `resultaat.txt`.

Dit zou er met promises als volgt uitzien:

```typescript
import { readFile, writeFile } from "fs/promises";

readFile("getal1.txt", "utf-8").then((getal1) => {
    readFile("getal2.txt", "utf-8").then((getal2) => {
        multiply(parseInt(getal1), parseInt(getal2)).then((result) => {
            writeFile("resultaat.txt", result.toString(), "utf-8").then(() => {
                console.log("Done");
            });
        });
    });
});
```

Dit kan met async en await als volgt:

```typescript
import { readFile, writeFile } from "fs/promises";

async function main() {
    try {
        const getal1 = await readFile("getal1.txt", "utf-8");
        const getal2 = await readFile("getal2.txt", "utf-8");
        const result = await multiply(parseInt(getal1), parseInt(getal2));
        await writeFile("resultaat.txt", result.toString(), "utf-8");
        console.log("Done");
    } catch (error) {
        console.log(error);
    }
}
```

Zo zie je dat de code veel leesbaarder is geworden en veel minder indentatie heeft.

#### Testen van errors

Eigenlijk is het niet logisch dat de `areaRectangle` functie een negatieve oppervlakte teruggeeft. Dus in dit geval zouden we er voor kunnen kiezen om een fout te gooien als een van de inputs negatief is. Dan moeten we uiteraard de code van de `areaRectangle` functie aanpassen en ook de tests aanpassen.

```typescript
export function areaRectangle(l: number, w: number): number {
    if (l < 0 || w < 0) {
        throw new Error('Length and width must be non-negative');
    }
    return l * w;
}
```

```typescript
import { describe, expect, test } from 'vitest';
import { areaRectangle } from './area';

describe('areaRectangle', () => {
    test('should return the correct area of a rectangle', () => {
        expect(areaRectangle(2, 3)).toBe(6);
        expect(areaRectangle(5, 10)).toBe(50);
    });

    test('should return 0 if one of the sides is 0', () => {
        expect(areaRectangle(0, 3)).toBe(0);
        expect(areaRectangle(5, 0)).toBe(0);
    });

    test('should throw an error if one of the sides is negative', () => {
        expect(() => areaRectangle(-2, 3)).toThrow('Length and width must be non-negative');
        expect(() => areaRectangle(5, -10)).toThrow('Length and width must be non-negative');
    });
});
```

Je vraagt je misschien af waarom we hier gebruik maken van een callback functie die een fout gooit in plaats van gewoon `expect(areaRectangle(-2, 3)).toBe(-6)`. Om te voorkomen dat de test direct faalt bij het uitvoeren van `areaRectangle(-2, 3)` omdat deze een fout gooit. Door deze aan te passen naar een callback functie, kunnen we de fout opvangen en controleren of deze de juiste boodschap bevat.

### Andere testmethodes

Naast `toBe` en `toBeCloseTo` zijn er nog heel veel andere testmethodes die je kan gebruiken in Vitest. Hier is een overzicht van de meest gebruikte testmethodes:

| **Testmethode** | **Beschrijving**                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `toBe`          | Controleert of twee waarden exact gelijk zijn.                                                        |
| `toEqual`       | Controleert of twee objecten gelijk zijn (diep gelijkheid).                                                   |
| `toBeNull`      | Controleert of een waarde `null` is.                                                                                   |
| `toBeUndefined` | Controleert of een waarde `undefined` is.                                                                                   |
| `toBeTruthy`    | Controleert of een waarde waarachtig is (niet `false`, `0`, `''`, `null`, `undefined`, of `NaN`). |
| `toBeFalsy`     | Controleert of een waarde onwaarachtig is (`false`, `0`, `''`, `null`, `undefined`, of `NaN`). |
| `toContain`     | Controleert of een array of string een bepaalde waarde bevat. |
| `toHaveLength`  | Controleert of een array of string een bepaalde lengte heeft. |
| `toThrow`       | Controleert of een functie een fout gooit. |
| `toBeCloseTo`   | Controleert of twee getallen dicht bij elkaar liggen, rekening houdend met afrondingsfouten. |
| `toBeNaN`        | Controleert of een waarde `NaN` is. |

Er zijn nog veel meer testmethodes beschikbaar in Vitest, maar dit zijn de meest gebruikte. Je kan altijd de [Vitest documentatie](https://vitest.dev/api/expect.html) raadplegen voor een volledig overzicht van alle testmethodes.
