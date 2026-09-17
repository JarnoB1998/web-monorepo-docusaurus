# Transportmiddelen

Maak een nieuw project aan met de naam `transportmiddelen`.

**Gebruik voor deze oefening classes, geen object literals!**

Maak een class `Voertuig`, deze bevat:

* property `naam` (`string`)
* property `brandstof` (`Brandstof`)
* methode `rijden()` met returntype `void`

Maak voor de `brandstof` property een nieuwe `type Brandstof` aan met de waarden `"BENZINE"`, `"ELEKTRISCH"` en `"GEEN"`: zie [String union](../../../nodejs-+-typescript/type-systeem/basic-types.md#string-union).

Gebruik `protected readonly` voor de properties, zodat de afgeleide classes ze kunnen lezen, maar ze na de constructor niet meer kunnen wijzigen. Voorzie een `public` constructor met getypeerde parameters om `naam` en `brandstof` in te stellen. Maak de methode `rijden()` ook `public`.

Maak vervolgens twee classes aan: `Auto` en `Fiets`, die met `extends` overerven van `Voertuig`. Voorzie in beide classes een constructor die de waarden via `super()` doorgeeft aan de basisklasse. Overschrijf de methode `rijden()` met `public override`.

De methode `rijden()` toont volgende tekst:

* bij auto:

  ```text
  ${naam} rijdt op de weg met brandstof ${brandstof}
  ```

* bij fiets:

  ```text
  ${naam} rijdt op het fietspad met brandstof ${brandstof}
  ```

Maak vervolgens meerdere instanties aan van beide classes, bijvoorbeeld `bmw`, `tesla`, `koersfiets` en `speedelec`, en roep voor elke instantie de methode `rijden()` aan om de tekst in de console te tonen.

Verwachte uitvoer:

```text
bmw rijdt op de weg met brandstof BENZINE
tesla rijdt op de weg met brandstof ELEKTRISCH
koersfiets rijdt op het fietspad met brandstof GEEN
speedelec rijdt op het fietspad met brandstof ELEKTRISCH
```
