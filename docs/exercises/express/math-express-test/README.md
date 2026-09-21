# Math Express Test

Download het <a href="/exercises/express/math-express-test/starter.zip">starter</a> project. Dit project bevat een express applicatie die een GET en een POST van `/sum` endpoint voorziet. De GET endpoint verwacht twee query parameters `a` en `b` en geeft de som van deze twee getallen terug. De POST endpoint verwacht een JSON body met twee getallen `a` en `b` en geeft de som van deze twee getallen terug.

Schrijf de volgende tests aan de hand van `vitest` en `supertest`:

- Test dat de POST/GET endpoint de som van twee getallen teruggeeft.
- Test dat de POST/GET endpoint een error geeft als een string wordt meegegeven. (bv "five")
- Test dat de POST/GET endpoint een error geeft als een parameter ontbreekt.
- Run de testen met de code coverage tool en ga na of alles getest is.

