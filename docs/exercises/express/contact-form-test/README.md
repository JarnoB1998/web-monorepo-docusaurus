# Contact Form Test

Vertrek vanuit je eigen oplossing van de <a href="../contact-form">Contact Form</a> oefening of vertrek vanuit de <a href="/exercise-files/express/contact-form/solution.zip">oplossing</a>.

- Splits de applicatie op in een `app.ts` en een `index.ts` zodat je hem kan testen.

Schrijf de volgende testen aan de hand van `vitest` en `supertest`:

- Test dat `GET /contact` een pagina teruggeeft met een formulier.
- Test dat `POST /contact` met alle geldige velden een bedanktbericht toont met de naam en het e-mailadres van de gebruiker.
- Test dat `POST /contact` zonder het aanvinken van de algemene voorwaarden een foutmelding toont.
- Test dat `POST /contact` met een lege voornaam een foutmelding toont.
- Test dat `POST /contact` met een leeg bericht een foutmelding toont.

Run de testen met de code coverage tool en ga na of alles getest is.
