# Exceptions Test

Maak zelf een nieuw TypeScript + Vitest project aan (zie de theorie voor de installatiestappen). Maak een module `validator.ts` met de volgende functies:

- `validateAge(age: number): void` — gooit een `Error` als de leeftijd kleiner dan of gelijk aan 0 is, of groter dan 150.
- `validateUsername(username: string): void` — gooit een `Error` als de gebruikersnaam korter is dan 3 of langer dan 20 karakters.

Schrijf daarna de bijhorende testen in `validator.test.ts`. Zorg dat je de volgende gevallen test:

- `validateAge` gooit **geen** error bij een geldige leeftijd (bv. 25).
- `validateAge` gooit een error als de leeftijd 0 of negatief is.
- `validateAge` gooit een error als de leeftijd groter is dan 150.
- `validateUsername` gooit **geen** error bij een geldige gebruikersnaam (bv. `"alice"`).
- `validateUsername` gooit een error als de gebruikersnaam korter is dan 3 karakters.
- `validateUsername` gooit een error als de gebruikersnaam langer is dan 20 karakters.
- Run de testen met de code coverage tool en ga na of alles getest is.
