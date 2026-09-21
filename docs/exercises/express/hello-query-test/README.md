# Hello Query Test

Vertrek vanuit je eigen oplossing van de <a href="../hello-query">Hello Express</a> oefening of vertrek vanuit de <a href="../hello-query/solution.zip">oplossing</a>.

- Splits de applicatie op in een `app.ts` en een `index.ts` zodat je hem kan testen.

Schrijf de volgende testen aan de hand van `vitest` en `supertest`:

- Test dat `GET /?language=en` de tekst "Hello World!" toont in een `<h1>` element.
- Test dat `GET /?language=es` de tekst "¡Hola Mundo!" toont in een `<h1>` element.
- Test dat `GET /?language=fr` de tekst "Bonjour le monde!" toont in een `<h1>` element.
- Test dat een ongeldige taalcode (bv. `?language=de`) standaard "Hello World!" toont.
- Test dat een ontbrekende `language` parameter standaard "Hello World!" toont.

Run de testen met de code coverage tool en ga na of alles getest is.
