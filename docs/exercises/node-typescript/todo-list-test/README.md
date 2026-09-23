# Todo List Test

Maak zelf een nieuw TypeScript + Vitest project aan (zie de theorie voor de installatiestappen). Maak een module `todo-list.ts` met de volgende functies:

- `addTodo(todos: string[], task: string): void` — voegt een taak toe aan de lijst.
- `removeTodo(todos: string[], index: number): void` — verwijdert de taak op de opgegeven index. Gooit een `Error` als de index ongeldig is (negatief of te groot).
- `countTodos(todos: string[]): number` — geeft het aantal taken terug.
- `clearTodos(todos: string[]): void` — verwijdert alle taken.

Schrijf daarna de bijhorende testen in `todo-list.test.ts`. Gebruik `beforeEach` om voor elke test een lege array aan te maken, zodat testen die de array aanpassen elkaar niet beïnvloeden. Zorg dat je de volgende gevallen test:

- `addTodo` voegt een taak toe aan de lijst.
- `addTodo` voegt meerdere taken toe aan de lijst.
- `countTodos` geeft het juiste aantal taken terug.
- `removeTodo` verwijdert de taak op de opgegeven index.
- `removeTodo` gooit een error als de index ongeldig is (negatief of te groot).
- `clearTodos` verwijdert alle taken.
- Run de testen met de code coverage tool en ga na of alles getest is.
