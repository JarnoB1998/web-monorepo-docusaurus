# Opdracht: Spreuken beheren in een Harry Potter-toepassing

## Doel
Je breidt een bestaande webtoepassing uit die een lijst van Harry Potter-spreuken toont. Je voegt functionaliteit toe om spreuken aan te maken, aan te passen en te verwijderen. De gegevens worden opgeslagen in een MongoDB-database. De front-end is opgebouwd met EJS.

Je kan het bestaande project vinden in het <a href="/exercise-files/mongodb/hogwarts-express-crud/starter.zip">starter.zip</a> bestand.

## Wat is er al voorzien?
- Een overzichtspagina met zoek- en sorteermogelijkheden
- Een detailpagina per spreuk
- Een MongoDB-verbinding
- Een datastructuur `Spell` en een basistemplate met EJS

## Opdracht
Breid de bestaande toepassing uit met de volgende functionaliteit:

### 1. Create
- Voeg een GET-route toe voor `/spells/create` die een formulier toont.
- Voeg een POST-route toe die een nieuwe spreuk aanmaakt in de database.
- Genereer het formulier dynamisch op basis van `res.locals.FIELDS` en `res.locals.SPELL_TYPES`.
- Ken automatisch een uniek ID toe aan de nieuwe spreuk (hoogste bestaande ID + 1).

### 2. Update
- Voeg een GET-route toe voor `/spells/:id/update` die het bestaande formulier toont, vooraf ingevuld met de huidige gegevens.
- Voeg een POST-route toe die de aangepaste gegevens opslaat.
- Het `id`-veld moet read-only zijn.

### 3. Delete
- Voeg een POST-route toe voor `/spells/:id/delete` die een spreuk verwijdert.
- Voeg op de overzichtspagina een verwijderknop toe per rij.

## Gegevensstructuur
Gebruik de bestaande types:
- `Spell` voor de data
- `SpellField` voor de formuliervelden

Ondersteunde invoertypes zijn: `text`, `number`, en `spelltype` (een dropdown).

## Te bewerken of toe te voegen bestanden
- `index.ts`: routes toevoegen
- `database.ts`: functies schrijven voor `createSpell`, `updateSpellById`, `deleteSpellById`
- `views/createSpell.ejs` en `views/updateSpell.ejs`: formulieren bouwen
- `views/index.ejs`: knoppen toevoegen voor "Create", "Update" en "Delete"

## Wat wordt er verwacht?
- Een werkend formulier voor het toevoegen van nieuwe spreuken
- Mogelijkheid om bestaande spreuken te bewerken
- Mogelijkheid om spreuken te verwijderen via de overzichtspagina
- Alle formulieren gebruiken `FIELDS` en `SPELL_TYPES` om inputs correct te genereren
