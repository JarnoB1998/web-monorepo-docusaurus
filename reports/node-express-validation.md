# Validatie Node.js- en Express-oefeningen

Alle 79 bestaande `starter`- en `solution`-projecten onder `docs/exercises/node-typescript` (43) en `docs/exercises/express` (36) zijn gemigreerd en uitgevoerd: 10 starters en 69 solutions.

## Configuratie

De basis komt uit `create-clean-node/template_node` en `create-clean-node/template_express_ejs`: Node.js >=24.12.0, ES modules, native uitvoering van TypeScript, TypeScript ^7.0.2 en Vitest ^5.0.1. Express-projecten gebruiken Express ^5.2.1 en de bijbehorende template-afhankelijkheden. Oefeningsspecifieke dependencies zijn behouden. De bestaande lockfiles zijn vernieuwd.

`npm start` controleert eerst de types; Express gebruikt daarbij nodemon zoals de template. `npm test` voert typechecking en Vitest uit. Projecten zonder testbestanden gebruiken `--passWithNoTests`. Lege testopgaven blijven expliciete `test.todo`-opgaven. Dat levert geen inhoudelijke testdekking op. Library-oefeningen starten hun bestaande module als er geen `index.ts` bestaat.

Imports, JSON-importattributen, type-imports, directorypaden en constructorvelden zijn aangepast voor native TypeScript en ES modules. Jest-configuratie en Jest/ts-node-afhankelijkheden zijn verwijderd.

## Uitgevoerde controles

- Getest met Node.js v24.18.0 in afzonderlijke scratchkopieën. Acht unieke dependencycombinaties zijn geïnstalleerd; projecten met dezelfde combinatie delen uitsluitend de geïnstalleerde dependencies.
- Alle 79 `npm test`-commando's slagen, inclusief `tsc --noEmit`. De tabel onderscheidt uitgevoerde tests, TODO's, templatevoorbeelden en ontbrekende tests.
- Alle 79 projecten zijn daadwerkelijk met `npm start` gestart. Terminalprogramma's kregen waar nodig voorbeeldinvoer. Express-apps zijn met HTTP-verzoeken gecontroleerd op representatieve routes; een test-preload liet servers op vrije lokale poorten luisteren. Publieke API-aanroepen zijn echt uitgevoerd.
- Bij 78 projecten zijn de uitgevoerde runtimecontroles geslaagd. Word Guess-starter start ook, maar `/guess` beantwoordt het verzoek nog niet: de route is bewust leeg en moet door studenten worden ingevuld. Deze opgave is niet opgelost.
- De 12 tests van de cursusrepository slagen. De productiebuild slaagt, met waarschuwingen over kapotte links en een mislukte Docusaurus-updatecheck.

Dit zijn controles van bestaande tests en representatieve uitvoeringen, geen volledige functionele dekking van iedere invoer en route. Succesvolle externe API-aanroepen garanderen geen toekomstige beschikbaarheid.

## Gevonden en herstelde problemen

- Slopify-solution: een niet-numeriek aankoop-ID gaf een redirect in plaats van de verwachte fout. De bestaande test slaagt nu. Importeren van starter en solution voor tests start geen server meer.
- Todo List String-solution: afvinken gebruikte een verkeerde array-index en kon `[X] undefined` tonen.
- Bitcoin API-solution: het oude API-adres is vervangen door het adres dat al in de opgave staat; de uitvoer is opnieuw gecontroleerd.
- Catstatic-solution: de startfile bevatte alleen Hello World. De bestaande oplossing uit het meegeleverde zipbestand is uitgepakt, gemigreerd en gecontroleerd, inclusief de afbeeldingenroute en een afbeelding. Het verouderde zipbestand is verwijderd.
- Async Test-solution: de negatieve test gebruikt nu een afgewachte `rejects.toThrow`-assertie.

## Resultaat per project

`OK` bij uitvoering betekent dat de gekozen uitvoering/HTTP-controles slaagden. Bij modules zonder interactieve toepassing betekent het dat de module zonder fout geladen werd.

| Project | Typecheck | Vitest | Uitvoering |
| --- | --- | --- | --- |
| [express/bitcoin-current/solution](../docs/exercises/express/bitcoin-current/solution/package.json) | OK | Geen testbestanden | OK |
| [express/catstatic/solution](../docs/exercises/express/catstatic/solution/package.json) | OK | Geen testbestanden | OK |
| [express/contact-form-test/solution](../docs/exercises/express/contact-form-test/solution/package.json) | OK | 5 passed (5) | OK |
| [express/contact-form-test/starter](../docs/exercises/express/contact-form-test/starter/package.json) | OK | 2 todo (2) | OK |
| [express/contact-form/solution](../docs/exercises/express/contact-form/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/dadjoke-express/solution](../docs/exercises/express/dadjoke-express/solution/package.json) | OK | Geen testbestanden | OK |
| [express/form-express-test/solution](../docs/exercises/express/form-express-test/solution/package.json) | OK | 3 passed (3) | OK |
| [express/form-express-test/starter](../docs/exercises/express/form-express-test/starter/package.json) | OK | 1 todo (1) | OK |
| [express/hello-express-ejs/solution](../docs/exercises/express/hello-express-ejs/solution/package.json) | OK | Geen testbestanden | OK |
| [express/hello-express/solution](../docs/exercises/express/hello-express/solution/package.json) | OK | Geen testbestanden | OK |
| [express/hello-query-test/solution](../docs/exercises/express/hello-query-test/solution/package.json) | OK | 5 passed (5) | OK |
| [express/hello-query-test/starter](../docs/exercises/express/hello-query-test/starter/package.json) | OK | 1 todo (1) | OK |
| [express/hello-query/solution](../docs/exercises/express/hello-query/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/maaltafels-ejs/solution](../docs/exercises/express/maaltafels-ejs/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/math-express-test/solution](../docs/exercises/express/math-express-test/solution/package.json) | OK | 6 passed (6) | OK |
| [express/math-express-test/starter](../docs/exercises/express/math-express-test/starter/package.json) | OK | 1 todo (1) | OK |
| [express/math-service-express/solution](../docs/exercises/express/math-service-express/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/newspaper-route/solution](../docs/exercises/express/newspaper-route/solution/package.json) | OK | Geen testbestanden | OK |
| [express/newspaper-search/solution](../docs/exercises/express/newspaper-search/solution/package.json) | OK | Geen testbestanden | OK |
| [express/newspaper/solution](../docs/exercises/express/newspaper/solution/package.json) | OK | Geen testbestanden | OK |
| [express/pet-shelter-express-test/solution](../docs/exercises/express/pet-shelter-express-test/solution/package.json) | OK | 6 passed (6) | OK |
| [express/petshelter-form/solution](../docs/exercises/express/petshelter-form/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/rate-limiter-middleware/solution](../docs/exercises/express/rate-limiter-middleware/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/redirect-form/solution](../docs/exercises/express/redirect-form/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/reiskosten-server/solution](../docs/exercises/express/reiskosten-server/solution/package.json) | OK | Geen testbestanden | OK |
| [express/router-combi/solution](../docs/exercises/express/router-combi/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/slopify/solution](../docs/exercises/express/slopify/solution/package.json) | OK | 18 passed (18) | OK |
| [express/slopify/starter](../docs/exercises/express/slopify/starter/package.json) | OK | Geen testbestanden | OK |
| [express/steam/solution](../docs/exercises/express/steam/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/steam/starter](../docs/exercises/express/steam/starter/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/twitter/solution](../docs/exercises/express/twitter/solution/package.json) | OK | Geen testbestanden | OK |
| [express/twitter/starter](../docs/exercises/express/twitter/starter/package.json) | OK | Geen testbestanden | OK |
| [express/utility-middleware/solution](../docs/exercises/express/utility-middleware/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/viewcounter/solution](../docs/exercises/express/viewcounter/solution/package.json) | OK | Geen testbestanden | OK |
| [express/word-guess/solution](../docs/exercises/express/word-guess/solution/package.json) | OK | 1 passed (1) (templatevoorbeeld) | OK |
| [express/word-guess/starter](../docs/exercises/express/word-guess/starter/package.json) | OK | 1 passed (1) (templatevoorbeeld) | Start OK; /guess wacht (lege oefenroute) |
| [node-typescript/array-sum/solution](../docs/exercises/node-typescript/array-sum/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/async-test/solution](../docs/exercises/node-typescript/async-test/solution/package.json) | OK | 5 passed (5) | OK |
| [node-typescript/async-test/starter](../docs/exercises/node-typescript/async-test/starter/package.json) | OK | 1 todo (1) | OK |
| [node-typescript/at-least-two/solution](../docs/exercises/node-typescript/at-least-two/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/bitcoin-api/solution](../docs/exercises/node-typescript/bitcoin-api/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/bmi-calculator-multi/solution](../docs/exercises/node-typescript/bmi-calculator-multi/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/bmi-calculator/solution](../docs/exercises/node-typescript/bmi-calculator/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/cat-gpt/solution](../docs/exercises/node-typescript/cat-gpt/solution/package.json) | OK | 3 passed (3) | OK |
| [node-typescript/cocktails-api/solution](../docs/exercises/node-typescript/cocktails-api/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/cocktails-promise-all/solution](../docs/exercises/node-typescript/cocktails-promise-all/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/cowsay-module/solution](../docs/exercises/node-typescript/cowsay-module/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/dna-match/solution](../docs/exercises/node-typescript/dna-match/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/fake-fetch/solution](../docs/exercises/node-typescript/fake-fetch/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/filter-numbers/solution](../docs/exercises/node-typescript/filter-numbers/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/hello-name/solution](../docs/exercises/node-typescript/hello-name/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/interest-calculator/solution](../docs/exercises/node-typescript/interest-calculator/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/joke-api/solution](../docs/exercises/node-typescript/joke-api/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/math-fun/solution](../docs/exercises/node-typescript/math-fun/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/math-module/solution](../docs/exercises/node-typescript/math-module/solution/package.json) | OK | 11 passed (11) | OK |
| [node-typescript/math-test/solution](../docs/exercises/node-typescript/math-test/solution/package.json) | OK | 6 passed (6) | OK |
| [node-typescript/math-test/starter](../docs/exercises/node-typescript/math-test/starter/package.json) | OK | 1 todo (1) | OK |
| [node-typescript/movies-functions/solution](../docs/exercises/node-typescript/movies-functions/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/movies-objects/solution](../docs/exercises/node-typescript/movies-objects/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/name-from-email/solution](../docs/exercises/node-typescript/name-from-email/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/pokemon-array/solution](../docs/exercises/node-typescript/pokemon-array/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/pokemon-team/solution](../docs/exercises/node-typescript/pokemon-team/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/puntenboek/solution](../docs/exercises/node-typescript/puntenboek/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/rainbow-chalk/solution](../docs/exercises/node-typescript/rainbow-chalk/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/recepten/solution](../docs/exercises/node-typescript/recepten/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/rot13/solution](../docs/exercises/node-typescript/rot13/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/school-api/solution](../docs/exercises/node-typescript/school-api/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/short-notation/solution](../docs/exercises/node-typescript/short-notation/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/slow-sum/solution](../docs/exercises/node-typescript/slow-sum/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/som-van-getallen/solution](../docs/exercises/node-typescript/som-van-getallen/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/text-box/solution](../docs/exercises/node-typescript/text-box/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/tic-tac-toe/solution](../docs/exercises/node-typescript/tic-tac-toe/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/todo-list-fetch/solution](../docs/exercises/node-typescript/todo-list-fetch/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/todo-list-objects/solution](../docs/exercises/node-typescript/todo-list-objects/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/todo-list-string/solution](../docs/exercises/node-typescript/todo-list-string/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/transportmiddelen/solution](../docs/exercises/node-typescript/transportmiddelen/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/unix-timestamp-api/solution](../docs/exercises/node-typescript/unix-timestamp-api/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/uren-en-minuten/solution](../docs/exercises/node-typescript/uren-en-minuten/solution/package.json) | OK | Geen testbestanden | OK |
| [node-typescript/wisselgeld/solution](../docs/exercises/node-typescript/wisselgeld/solution/package.json) | OK | Geen testbestanden | OK |
