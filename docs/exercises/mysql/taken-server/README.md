---
sidebar_position: 2
---

# Taken server

Maak een nieuw Express-project aan om taken te beheren.

Maak een nieuwe interface `Taak` aan. Een taak heeft een `omschrijving` en een `naam` (van wie de taak gaat doen). Bewaar in de database ook een automatisch gegenereerde `id`.

Maak ook een database tabel aan voor je taken.

Schrijf nu volgende API's:

* `GET /tasks` : alle taken opvragen
* `GET /task` : de eerstvolgende taak opvragen
* `POST /task` : een nieuwe taak toevoegen
* `DELETE /task` : een taak verwijderen (omdat deze werd uitgevoerd)

Gebruik een routerfunctie om je API's te bundelen.

Test je taken server via Postman.

De eerst toegevoegde taak wordt als eerste uitgevoerd. Geef bij `DELETE /task` de uitgevoerde taak terug als JSON. Geef status `404` terug als er geen volgende taak is.

Gebruik de werkwijze uit [MySQL in Express.js](../../../mysql/gebruik-in-express.md): zet de verbinding en alle databasefuncties in `database.ts`. Gebruik `mysql2/promise`, `async/await` en `execute()` met placeholders. Registreer `SIGINT` in `connect()` en sluit de verbinding in `exit()`. Zet de routes in een apart routerbestand.
