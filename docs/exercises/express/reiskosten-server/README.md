# Reiskosten server

Maak een nieuw Express-project aan om de kosten van je reizen te noteren.

Je wilt elke reis die je maakt in kunnen voeren en nadien aan deze reis kosten koppelen.

Maak om te beginnen een nieuwe class `Reis` aan. Een reis heeft vier velden: `id`, `bestemming`, `jaar` en `kosten`. Bij aanmaken van een `Reis`-object moet je de velden `id`, `bestemming` en `jaar` verplicht meegeven. Het veld `kosten` is bij aanmaak een lege array.

Maak vervolgens een nieuwe class `Kost` aan. Een kost heeft twee velden: `uitgave` en `prijs`. Beide velden moeten verplicht ingevuld worden bij aanmaak van de kost.

Gebruik de TypeScript-werkwijze uit [Classes](../../../nodejs-+-typescript/type-systeem/classes.md): type de velden en constructorparameters en gebruik `public`, `private` en waar passend `readonly`. Bewaar de kosten in een private array en voorzie een methode om een kost toe te voegen.

Voorzie een extra functie op je `Reis`- en `Kost`-class: `toJSON()`. Deze functie maakt een object aan met de waardes in de class. Geef ook dat object een type met een interface.

We werken zonder database, dus voorzie een interne array om je reisobjecten in te bewaren.

Maak volgende routes aan. Gebruik een routerfunctie in `routers/reizen_api.ts` om de routes samen te brengen.

* `GET /reizen`: geeft alle reizen uit de array in JSON-formaat terug.
* `POST /reis`: maakt één reis aan. De reis wordt in JSON-formaat doorgestuurd:

  ```json
  { "bestemming": "Londen", "jaar": 2024 }
  ```

  Zet deze JSON-gegevens om naar een `Reis`-object. Hou er rekening mee dat je een `id` moet meegeven aan de reis. Voorzie hiervoor een oplossing via een teller.
* `GET /reis/:reisid`: vraagt één reis op aan de hand van de requestparameter `reisid`.
* `POST /reis/:reisid/kost`: maakt één kost aan voor de reis met deze `reisid`. De kost wordt in JSON-formaat doorgestuurd:

  ```json
  { "uitgave": "treintickets", "prijs": 100 }
  ```

  Zet deze JSON-gegevens om naar een `Kost`-object en voeg dit object toe aan de kosten van de reis.
* `GET /reis/:reisid/kosten`: berekent het totaal aan kosten voor de reis met deze `reisid`. Tel de prijs van alle kosten op en geef enkel dat totaalbedrag terug als antwoord.

Test je server via Postman. Controleer ook een reis zonder kosten en een onbestaande `reisid`.
