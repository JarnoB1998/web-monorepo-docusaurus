# Nieuw project

Vooraleer we kunnen starten met het schrijven van een node applicatie moeten we eerst een nieuwe directory aanmaken waar we onze code in kunnen plaatsen.

We zullen in dit geval een nieuwe directory aanmaken met de naam `hello`. Je kan deze in een directory `theorie` plaatsen.

Vervolgens zorg je ervoor dat je in de `hello` directory zit aan de hand van het `cd` commando.

```bash
cd theorie/hello
```

## npm init

Nu we een nieuwe directory hebben aangemaakt kunnen we een nieuw project aanmaken. Dit doen we aan de hand van het `npm init` commando.

```bash
npm init
```

Dit commando zal een aantal vragen stellen over jouw project. Je kan deze gewoon beantwoorden door op enter te drukken. Als je dit commando hebt uitgevoerd zal je een nieuw bestand `package.json` zien in je directory. Dit bestand bevat alle informatie over jouw project. We zullen hier later nog op terugkomen.

## TypeScript configuratie

Nu we een nieuw project hebben aangemaakt moeten we een nieuwe TypeScript configuratie aanmaken. Dit doen we aan de hand van het `tsc --init` commando.

```bash
tsc --init
```

Dit commando zal een nieuw bestand `tsconfig.json` aanmaken in je directory. Dit bestand bevat alle configuratie opties voor de TypeScript compiler.

## Node types installeren

Nu we een TypeScript configuratie hebben aangemaakt moeten we de node types installeren. Dit zijn de types die nodig zijn om met TypeScript en Node.js te werken.

```bash
npm install --save-dev @types/node
```

Je zal zien dat er een nieuwe directory `node_modules` is aangemaakt in je project. Hierin zitten alle modules die je nodig hebt om je project te laten werken.

## Bestand aanmaken

Nu we alle configuratie hebben aangemaakt kunnen we beginnen met het schrijven van onze code. Maak een nieuw bestand `hello.ts` aan in de `hello` directory. De bestandsnaam mag je zelf kiezen.

Het bestand `hello.ts` moet het volgende bevatten:

```typescript
console.log("Hello, world!");
```

## Typechecking met TypeScript

Tijdens het programmeren controleert **VS Code** onze TypeScript-code voortdurend op mogelijke typefouten. Hierdoor krijgen we vaak al tijdens het schrijven van de code feedback wanneer er bijvoorbeeld een verkeerd type wordt gebruikt.

We kunnen onze code echter ook **manueel laten controleren** door de TypeScript-compiler (`tsc`). Hiervoor gebruiken we:

```
npx tsc --noEmit
```

De optie `--noEmit` zorgt ervoor dat TypeScript **geen JavaScript-bestanden genereert**. De compiler controleert alleen of onze TypeScript-code correct is en of er geen typefouten aanwezig zijn.

Dit is bijvoorbeeld handig voordat we onze code committen of opleveren. Zo kunnen we controleren of er nergens typefouten in het project zitten.

We kunnen dit commando ook opnemen in een **npm-script**, in het package.json bestand:

```
"scripts": {
  "typecheck": "tsc --noEmit"
}
```

Daarna kunnen we de typechecking uitvoeren met:

```
npm run typecheck
```

**Belangrijk:** VS Code geeft ons dus tijdens het programmeren onmiddellijk feedback, terwijl `tsc --noEmit` een volledige typecheck van ons project uitvoert zonder JavaScript-bestanden te genereren.

## Uitvoeren

Nu we ons programma hebben geschreven kunnen we dit uitvoeren. Dit kan je doen aan de hand van het `node` commando.

```bash
node hello.ts
```

Dit commando zal je programma uitvoeren en je zal `Hello, world!` zien verschijnen in je terminal.

## Samengevat

| Commando                             | Beschrijving                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `npm init`                           | Maakt een nieuw project aan.                                                          |
| `tsc --init`                         | Maakt een nieuw tsconfig bestand aan. Het initialiseert een nieuw TypeScript project. |
| `npm install --save-dev @types/node` | Installeert alle types die nodig zijn om met TypeScript en Node.js te werken.         |
| `node <naam file>.ts`                | Voert het programma uit dat je geschreven hebt in `<naam file>.ts`.                   |

Deze commando's zal je voor elk nieuw project moeten uitvoeren. Het is dus handig om deze te onthouden.

## create-clean-node

Er zijn talrijke scripts beschikbaar die het opzetten van een TypeScript of JavaScript project aanzienlijk vereenvoudigen. Een voorbeeld hiervan is `create-clean-node`, een tool waarmee je met slechts één commando een nieuw project kunt starten. Door het volgende in je terminal te typen:

```lua
npx create-clean-node
```

word je gevraagd om een projectnaam in te voeren, waarna `create-clean-node` automatisch alle benodigde afhankelijkheden installeert.
