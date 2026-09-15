# Projectafspraken

Richtlijnen voor het werken aan deze cursus (Docusaurus-site). Dit bestand wordt
automatisch ingeladen en is versiebeheerd, zodat afspraken met het team gedeeld worden.

## Algemene afspraken
- Taal is Vlaams-Nederlands, maar je mag Engelse termen gebruiken waar nodig (bv. in code, in componenten, in quizzen).
- Vermijd het gebruik van em-dashes.

## Quizzes ("Test je kennis")

- De sectiekop boven een quiz in de markdown is **`## Test je kennis`** — niet `## Quiz`.
- Onder de kop komt `<Quiz url="/quizzes/<naam>.json" />`, met bovenaan de pagina
  `import Quiz from '@site/src/components/Quiz';`.
- De quiz-JSON staat in `static/quizzes/<naam>.json`. De interne `"title"` volgt wél
  het patroon `"Quiz: <onderwerp>"` (bv. `"Quiz: Array.find()"`) — dat is intern en blijft zo.
- Het quiz-schema staat in `src/components/Quiz/types.ts` (vraagtypes: `single`,
  `multiple`, `text`, `code`, `fill`, `errors`).

### Opmaak in quizteksten

- `prompt`, `explanation` en `description` ondersteunen inline `` `code` ``, regeleinden
  én **fenced code blocks** (```` ```ts … ``` ````, gerenderd via Docusaurus' `@theme/CodeBlock`
  met syntax highlighting). Gebruik een taal-hint na de fence (`ts`, `js`, …).
- In de **opties** van keuzevragen: hou het bij inline code, geen fenced blocks
  (een codeblok naast een radio/checkbox oogt rommelig).

### Verdeling van juiste antwoorden

- Spreid bij `single`/`multiple`-vragen het juiste antwoord over de posities.
  Zet het juiste antwoord **niet** stelselmatig als eerste optie — wissel de
  volgorde af zodat het correcte antwoord ongeveer evenredig over index 0–3 valt.
