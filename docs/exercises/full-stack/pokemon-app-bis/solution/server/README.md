# pokemon-app-bis

Gebruik Node.js 22.12 of nieuwer. Voer `schema.sql` één keer uit in MySQL Workbench. Kopieer `.env.example` naar `.env` en vul je eigen gegevens in.

```bash
npm install
npm start
```

Typecontrole: `npm run typecheck`. De API draait op `http://localhost:3000`. De tabellen worden in `database.ts` aangemaakt als ze nog niet bestaan. Bestaande gegevens blijven behouden. Sluit af met Ctrl+C: `exit()` sluit dan de databaseverbinding.
