# Modules

## Eigen Modules Maken

### Wat zijn modules?

Modules zijn een manier om je code te organiseren in verschillende bestanden. Vaak wil je bepaalde functies beschikbaar maken voor andere bestanden. Dit kan je doen door deze functies in een module te zetten. Je kan dan in andere bestanden deze module importeren en de functies gebruiken.

Eigenlijk heb je al modules gebruikt in vorige delen in de vorm van npm packages. Deze bevatten ook modules die je kan importeren in je eigen code.

## Waarom modules gebruiken?

Modules zijn een goede manier om je code te organiseren. Je kan je code opdelen in verschillende bestanden en deze bestanden kunnen dan met elkaar communiceren door middel van imports en exports. Dit maakt het makkelijker om je code te onderhouden en te begrijpen. Je kan ook gemakkelijk bepaalde functies of interfaces hergebruiken in verschillende bestanden zonder dat je deze telkens opnieuw moet schrijven.

### Hoe maak je een module?

Stel dat je een functie hebt om de oppervlakte te berekenen van een cirkel, vierkant en rechthoek.

```typescript
function areaCircle(r: number): number {
    return Math.PI * r * r;
}

function areaSquare(s: number): number {
    return s * s;
}

function areaRectangle(l: number, w: number): number {
    return l * w;
}
```

Tot nu toe heb je altijd deze functies in hetzelfde bestand gezet. Maar stel dat je deze functies ook in een ander bestand wil gebruiken. Dan kan je deze functies in een module zetten door gebruik te maken van een `export` statement.

```typescript
export function areaCircle(r: number): number {
    return Math.PI * r * r;
}

export function areaSquare(s: number): number {
    return s * s;
}

export function areaRectangle(l: number, w: number): number {
    return l * w;
}
```

Zorg er wel voor dat je deze functies in een apart bestand zet met de extensie `.ts`. In dit geval bijvoorbeeld `area.ts`.

### Hoe importeer je functies uit een module?

Wil je deze functies gebruiken in een ander bestand? Dan moet je deze eerst importeren aan de hand van het volgende commando.

```typescript
import { areaCircle, areaSquare, areaRectangle } from './area';
```

De functies die je wil importeren zet je tussen de accolades. Het gedeelte achter `from` is het pad naar het bestand waar de module in staat. In dit geval is dat `./area` omdat het bestand `area.ts` in dezelfde map staat als het bestand waar je de functies wil gebruiken. Plaats je de module in een andere map, dan moet je het pad aanpassen. Staat je `area.ts` bestand in de directory `functions` dan moet je het volgende commando gebruiken.

```typescript
import { areaCircle, areaSquare, areaRectangle } from './functions/area';
```

nu kan je deze functies gebruiken in je code net zoals je dat zou doen alsof ze in hetzelfde bestand staan.

```typescript
console.log(areaCircle(2));
console.log(areaSquare(2));
```

### Default exports

Heel vaak wordt er door een module maar één functie geëxporteerd. In dat geval kan je gebruik maken van een default export. Dit is een export zonder naam.

```typescript
export default function(r: number): number {
    return Math.PI * r * r;
}
```

Je kan deze functie dan importeren zonder tussen de accolades te zetten.

```typescript
import areaCircle from './area';
```

In principe maakt het niet uit welke naam je achter de import zet want er is maar één functie geëxporteerd.

```typescript
import area from './area';
```

### Interfaces exporteren

Tot nu toe hebben we altijd interfaces in hetzelfde bestand gezet als de code die deze interface gebruikt. Maar je kan ook interfaces exporteren uit een module.

```typescript
export interface Person {
    name: string;
    age: number;
}
```

We plaatsen deze interfaces vaak in een apart bestand met de naam `types.ts`. Gebruik `import type` om een interface of type in een ander bestand te importeren:

```typescript
import type { Person } from './types.ts';
```

Types en interfaces bestaan alleen tijdens de typecontrole. Met `import type` geef je aan dat deze import bij het uitvoeren van je code verwijderd moet worden.
