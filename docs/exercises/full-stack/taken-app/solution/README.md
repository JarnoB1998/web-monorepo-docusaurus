# Taken

De oplossing bestaat uit een apart `server`- en `client`-project, zoals in **Van form naar database**.

1. Voer `server/schema.sql` uit in MySQL Workbench.
2. Kopieer `server/.env.example` naar `server/.env` en vul je databasegegevens in.
3. Open een terminal in `server`: voer `npm install` en `npm start` uit.
4. Open een tweede terminal in `client`: voer `npm install` en `npm run dev` uit.
5. Open `http://localhost:5173`.

De tabellen worden bij de eerste start aangemaakt. Databasefuncties staan in `server/database.ts`, routes in `server/routers/`. Ctrl+C sluit via `exit()` de databaseverbinding af.

De client gebruikt getypeerde DOM-selectors, fetch en async/await. Beide projecten hebben `npm run typecheck` en `npm run build`.
