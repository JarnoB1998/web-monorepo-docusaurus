# Pet Shelter Express Test

Vertrek vanuit je eigen oplossing van de <a href="../petshelter-form">Pet Shelter</a> oefening of vertrek vanuit de <a href="/exercise-files/express/petshelter-form/solution.zip">oplossing</a>.

- Splits de applicatie op in een `app.ts` en een `index.ts` zodat je hem kan testen.

Schrijf de volgende testen aan de hand van `vitest` en `supertest`:

- Test dat `GET /` een pagina teruggeeft met een formulier.
- Test dat het formulier een invoerveld voor de naam bevat.
- Test dat het formulier een dropdown bevat met de opties `dog`, `cat` en `rabbit`.
- Test dat `POST /` met een naam en een diersoort een pagina teruggeeft die de naam en het dier toont.
- Test dat `POST /` werkt voor alle drie de diersoorten.
- Test dat de response na een `POST /` een afbeelding bevat.

Run de testen met de code coverage tool en ga na of alles getest is.
