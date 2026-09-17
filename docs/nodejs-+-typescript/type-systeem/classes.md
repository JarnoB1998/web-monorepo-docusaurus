---
sidebar_position: 4
---

# Class

## Object Oriented Programming ( OOP )

OOP is een manier van programmeren waarbij je werkt met objecten in plaats van alleen functies en gegevens. Elk object is gemodelleerd op de realiteit en heeft eigenschappen (properties) en methodes (methods). Bijvoorbeeld: een object 'planeet' zou als eigenschappen kunnen hebben 'naam' en 'radius' en als methode 'toonNaam()'.

Deze programmeerstijl helpt bij het organiseren van code, zodat deze makkelijker is om te begrijpen en te hergebruiken. Het maakt grote programma's overzichtelijker door de code op te delen in kleinere stukjes die dan objecten worden genoemd.

De belangrijkste eigenschappen van OOP zijn :

* overerving (inheritance)
* inkapselen (encapsulation)
* polymorfisme (polymorphism)

Wij zullen vooral aan de slag gaan met inkapselen en overerving.

Als we zeggen dat een object eigenschappen heeft ingekapseld, dan wil dat zeggen dat het object:

* deze eigenschappen beheert
* bepaalt welke eigenschappen nodig zijn om correct te werken
* regelt welke eigenschappen mogen wijzigen

Als we zeggen dat een class overerft van een andere class, dan wil dat zeggen dat de afgeleide class:

* de eigenschappen van het andere object gebruikt
* deze eigenschappen eventueel kan overschrijven

:::info
TypeScript ondersteunt objectgeoriënteerd programmeren. De classes gebruiken het prototype-systeem van JavaScript voor overerving.

In deze cursus gebruiken we de TypeScript-modifiers `public`, `protected` en `private`. TypeScript controleert deze toegangsregels tijdens de typecontrole. JavaScript kent ook `#`-velden, die tijdens de uitvoering afgeschermd zijn; die gebruiken we hier niet.
:::

## Class

```typescript
class Planet {
    private _name: string;
    public constructor(name: string) {
        this._name = name;
    }
}
```

Met het `class` keyword definiëren we een class in TypeScript. Een class is de beschrijving waarmee we objecten kunnen aanmaken.

De naam van de class laten we met een hoofdletter beginnen. We gebruiken dus PascalCase voor de naamgeving van een class.

De eigenschappen en methodes van de class zitten tussen accolades.

Een class kan een constructor hebben. De constructor is een speciale soort functie die éénmalig uitgevoerd wordt bij het aanmaken van elk object. De constructor kan eveneens argumenten hebben. Verplichte argumenten moeten bij het aanmaken van het object meegegeven worden. Constructorparameters krijgen een type; de constructor zelf krijgt geen returntype.

## Een class gebruiken

Als we een class hebben gedefinieerd hebben we eigenlijk een nieuw soort data type aangemaakt dat we kunnen gebruiken om nieuwe variabelen aan te maken.

```typescript
let earth: Planet = new Planet("Aarde");
```

Net zoals bij andere datatypes zijn er twee onderdelen: declaratie en initialisatie.

De declaratie `let earth: Planet` zorgt ervoor dat we een nieuwe variabele met naam 'earth' aanmaken en deze is van het type 'Planet'.

Met initialisatie `= new Planet("Aarde");` wordt het object effectief aangemaakt en zijn de eigenschappen van het object beschikbaar. Gebruik het keyword **new** om aan te geven dat je een nieuw object aanmaakt. Het keyword new wordt gevolgd door de naam van de class en haakjes.

Tussen de haakjes geef je de waardes mee om de argumenten van de constructor op te vullen. Heeft de constructor geen argumenten of is er geen constructor, dan laat je de haakjes leeg. Als de constructor verplichte parameters heeft, moeten de bijbehorende argumenten van het correcte type worden meegegeven. Parameters met een standaardwaarde of een `?` zijn optioneel.

## Eigenschappen (properties)

Een object heeft typisch één of meerdere eigenschappen.

Volgens het inkapselen principe moeten deze eigenschappen beheerd worden door het object. Het mag dus niet zijn dat een gebruiker rechtstreeks een interne eigenschap kan aanpassen. Dit gedrag dwingen we af door de interne eigenschap privaat te zetten waardoor een gebruiker deze niet kan aanpassen.

Een veld privaat maken doen we in TypeScript door `private` voor de veldnaam te zetten. We schrijven ook het type van het veld expliciet.

### public, private en protected

Met een visibility modifier bepalen we vanwaar een veld of methode toegankelijk is:

| Modifier | In de eigen class | In een afgeleide class | Buiten de class |
| --- | --- | --- | --- |
| `public` | Ja | Ja | Ja |
| `protected` | Ja | Ja | Nee |
| `private` | Ja | Nee | Nee |

Zonder modifier is een veld of methode standaard `public`. We schrijven de modifier expliciet, zodat de bedoeling duidelijk is. De constructor van onze voorbeelden is ook `public`, zodat we buiten de class een object met `new` kunnen maken.

```typescript
class Planet {
    public radius: number;
    private _name: string;

    public constructor(name: string, radius: number) {
        this._name = name;
        this.radius = radius;
    }

    public displayName(): void {
        console.log("De naam van de planeet is " + this._name);
    }
}

const earth: Planet = new Planet("Aarde", 6371);
earth.radius = 6372;
earth.displayName();
// earth._name = "Mars"; // Typefout: _name is private.
```

Verder in het hoofdstuk gebruiken we `protected` om een veld beschikbaar te maken in afgeleide classes.

### Constructors en veldinitialisatie

Met `strict: true` controleert TypeScript of verplichte velden een beginwaarde krijgen. Je geeft die waarde mee bij de velddeclaratie of kent ze toe in de constructor. We gebruiken geen `!` om die controle te omzeilen.

```typescript
class Planet {
    private _name: string;
    public radius: number = 0;

    public constructor(name: string) {
        this._name = name;
    }
}
```

Hier krijgt `_name` zijn waarde in de constructor en krijgt `radius` meteen een standaardwaarde.

### readonly

Een `readonly` veld mag een waarde krijgen bij de declaratie of in de constructor. Daarna mag je er geen andere waarde meer aan toekennen. Je combineert `readonly` met een visibility modifier.

```typescript
class Planet {
    public readonly name: string;
    private readonly radius: number;

    public constructor(name: string, radius: number) {
        this.name = name;
        this.radius = radius;
    }

    public getDiameter(): number {
        return this.radius * 2;
    }
}

const earth: Planet = new Planet("Aarde", 6371);
console.log(earth.name);
console.log(earth.getDiameter()); // 12742
// earth.name = "Mars"; // Typefout: name is readonly.
```

`readonly` bepaalt of je een veld kan herzetten; `public`, `protected` en `private` bepalen wie er toegang toe heeft. Bij een object of array maakt `readonly` de inhoud niet automatisch onveranderbaar.

### Velden via constructorparameters

TypeScript kan een veld rechtstreeks uit een constructorparameter aanmaken. Plaats daarvoor `public`, `protected`, `private` of `readonly` voor de parameter. Dit noemen we **parameter properties**.

```typescript
class Planet {
    public constructor(
        public readonly name: string,
        private radius: number = 0
    ) {}

    public getDiameter(): number {
        return this.radius * 2;
    }
}

const earth: Planet = new Planet("Aarde", 6371);
console.log(earth.name);
console.log(earth.getDiameter()); // 12742
```

TypeScript maakt hier de velden `name` en `radius` aan en kent de argumenten automatisch toe. Je hoeft de velden niet nog eens afzonderlijk te declareren of met `this` toe te wijzen. Een constructorparameter zonder zo’n modifier is alleen een parameter en maakt geen veld aan.

### static

Een `static` veld hoort bij de class zelf en wordt gedeeld door alle objecten van die class. Je spreekt het aan via de classnaam.

```typescript
class Planet {
    public static count: number = 0;

    public constructor(public readonly name: string) {
        Planet.count += 1;
    }
}

const earth: Planet = new Planet("Aarde");
const mars: Planet = new Planet("Mars");
console.log(Planet.count); // 2
```

`name` hoort bij één object; `count` hoort bij de class `Planet`.

### get / set

Om een private eigenschap gecontroleerd beschikbaar te maken voor de gebruiker kunnen we `get` en `set` gebruiken.

```typescript
class Planet {
    private _name: string;
    public constructor(name: string) {
        this._name = name;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
}
```

Bij gebruik van `get` en `set` gebruiken we de volgende vorm:

* `public get` of `public set` gevolgd door een spatie
* de naam van de publieke eigenschap, in dit voorbeeld `name`. Het private veld noemen we `_name` om beide namen te onderscheiden; het underscore is een naamgevingsafspraak, geen toegangsmodifier.
* bij get lege haakjes '()' gevolgd door het return type van de variabele
* bij set exact 1 argument tussen de haakjes met het type van de variabele én géén return type

Je gebruikt de getter en setter als een eigenschap, zonder haakjes:

```typescript
const earth: Planet = new Planet("Aarde");
console.log(earth.name);
earth.name = "Terra";
console.log(earth.name); // Terra
```

Dit voorbeeld gebruikt de `Planet`-class met `get` en `set` hierboven. In een setter kan je een nieuwe waarde controleren voordat je die bewaart. Met alleen een getter bied je toegang om te lezen, zonder publieke setter.

### this

Om in een methode een veld of andere methode van het huidige object te gebruiken, schrijven we het keyword **this**. Met `this._name` spreken we bijvoorbeeld het veld `_name` van dat object aan. Een lokale variabele of constructorparameter zoals `name` is iets anders dan het veld `this._name`.

## Methodes (methods)

Naast eigenschappen kan een class ook methodes definiëren. Deze methodes zullen functionaliteit van het object aanbieden.

```typescript
class Planet {
    private _name: string;
    public constructor(name: string) {
        this._name = name;
    }
    public displayName(): void {
        console.log("De naam van de planeet is " + this._name);
    }
}
```

Methodes volgen de regels van functies maar dan zonder het keyword **function**.

## Overerving

Bekijken we volgende classes :

```typescript
class Cat {
    private _name: string;
    private _sound: string = "meows";
    public constructor(name: string) {
        this._name = name;
    }
    public makeSound(): void {
        console.log(this._name + " " + this._sound);
    }
}

let mycat: Cat = new Cat("Sylvester");
mycat.makeSound(); // Sylvester meows
```

```typescript
class Dog {
    private _name: string;
    private _sound: string = "barks";
    public constructor(name: string) {
        this._name = name;
    }
    public makeSound(): void {
        console.log(this._name + " " + this._sound);
    }
}

let mydog: Dog = new Dog("Spike");
mydog.makeSound(); // Spike barks
```

De classes Cat en Dog hebben best wel wat gedeelde eigenschappen. Als we nu ook nog een ander dier willen, bv een aap, dan zal waarschijnlijk deze er eveneens hetzelfde uitzien.

Als we duplicate eigenschappen opmerken dan kunnen we best de overerving techniek toepassen. Bij overerving zullen we een parent class maken die de gedeelde eigenschappen bevat.

```typescript
class Animal {
    protected _name: string;
    public constructor(name: string) {
        this._name = name;
    }
}
```

Het veld `_name` is `protected`: `Animal` en zijn afgeleide classes mogen het gebruiken, maar code buiten deze classes niet. Passen we deze parent class toe op de Cat en Dog zien we dit:

```typescript
class Cat extends Animal {
    private _sound: string = "meows";
    public constructor(name: string) {
        super(name);
    }
    public makeSound(): void {
        console.log(this._name + " " + this._sound);
    }
}

let mycat: Cat = new Cat("Sylvester");
mycat.makeSound(); // Sylvester meows
```

```typescript
class Dog extends Animal {
    private _sound: string = "barks";
    public constructor(name: string) {
        super(name);
    }
    public makeSound(): void {
        console.log(this._name + " " + this._sound);
    }
}

let mydog: Dog = new Dog("Spike");
mydog.makeSound(); // Spike barks
```

Het keyword **extends** geeft aan dat de class overerft van een parent class. Het veld `_name` zal m.a.w. door de Animal class beheerd worden. Echter bij aanmaak van de Cat of Dog wordt de naam met de constructor meegegeven. Om deze naam naar de parent door te geven gebruiken we **super()**. Dit roept de constructor van de parent class op en moet in de constructor gebeuren voordat we `this` gebruiken. Het overgeërfde `protected` veld spreken we aan met `this._name`. Met `super.naamVanMethode()` kunnen we een methode van de parent class oproepen; `super` omzeilt geen `private` toegangsregels.

In bovenstaande voorbeelden zien we nog duplicate code, de makeSound() methode is in beide gevallen hetzelfde en kan dus best ook naar de parent class Animal. Maar dan moeten we oplossen dat `_sound` op één of andere manier kan geconfigureerd worden, want het geluid is voor elk dier anders. De oplossing is als volgt:

```typescript
class Animal {
    private _name: string;
    private _sound: string;
    public constructor(name: string, sound: string) {
        this._name = name;
        this._sound = sound;
    }
    public makeSound(): void {
        console.log(this._name + " " + this._sound);
    }
}

class Cat extends Animal {
    public constructor(name: string) {
        super(name, "meows");
    }
}

class Dog extends Animal {
    public constructor(name: string) {
        super(name, "barks");
    }
}
```

We voorzien op de Animal class een extra argument in de constructor waardoor we het geluid mee kunnen geven vanuit de Cat of Dog constructor.

In deze laatste versie gebruikt alleen `Animal` de velden `_name` en `_sound`. Daarom zijn ze hier `private`. `Cat` en `Dog` geven hun waarden door via `super()` en erven de publieke methode `makeSound()` over.

```typescript
const mycat: Cat = new Cat("Sylvester");
const mydog: Dog = new Dog("Spike");
mycat.makeSound(); // Sylvester meows
mydog.makeSound(); // Spike barks
```

## Oefening

Pas classes en overerving toe in de oefening [Transportmiddelen](../../exercises/node-typescript/transportmiddelen/README.md).

Zie ook de [TypeScript-documentatie over classes](https://www.typescriptlang.org/docs/handbook/2/classes.html).
