---
sidebar_position: 1
---

# Reiskosten server met MySQL

Kopieer je code van [Reiskosten server](../../express/reiskosten-server/README.md) naar een nieuw project.

Pas de code aan zodat je de gegevens in een MySQL-database wegschrijft. Bewaar zowel de reizen als hun kosten. De kosten moeten gekoppeld zijn aan de juiste reis.

Gebruik de werkwijze uit [MySQL in Express.js](../../../mysql/gebruik-in-express.md): zet de verbinding en alle databasefuncties in `database.ts`. Gebruik `mysql2/promise`, `async/await` en `execute()` met placeholders. Registreer `SIGINT` in `connect()` en sluit de verbinding in `exit()`. Zet de routes in een apart routerbestand.

Behoud dezelfde classes en endpoints. Controleer via Postman of je reizen en kosten na het herstarten van je server nog beschikbaar zijn.
