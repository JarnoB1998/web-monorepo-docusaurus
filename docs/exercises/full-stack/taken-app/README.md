---
sidebar_position: 2
---

# Taken app

Vertrek van dit [starterproject](/exercise-files/full-stack/taken-app/starter.zip) voor de client. Het bevat de HTML en CSS; de TypeScript-code werk je zelf uit.

Maak twee projecten aan taken-client en taken-server.

Gebruik de server uit [Taken server met prioriteit](../../mysql/taken-server-met-prioriteit/README.md).

Maak nu een nieuwe Vite project voor je taken-client.

Voorzie in de client volgende features : 

* Toon je taken in volgorde van prioriteit op je scherm
* Maak een formulier om een taak toe te voegen
* Voorzie een knop om een taak uit te voeren. Als je op die knop hebt gedrukt toon dan in een alert de taak die je uit hebt gevoerd én ververs je lijst van taken op het scherm
* Voeg nu nog toe dat je een hoge prioriteitstaak kan toevoegen. Doe dit door een checkbox bij in je form te zetten. Let goed op want je zal de verwerking in je submit code moeten aanpassen.

## Werkwijze

Werk met een apart Vite-project voor de client en een Express-project voor de server, zoals in [Van form naar database](../../../full-stack/vite-planeten.md). Geef je interfaces, functies en DOM-selectors de juiste TypeScript-types. Configureer [CORS](../../../full-stack/cors.md) zodat de client op `http://localhost:5173` de API op `http://localhost:3000` kan aanspreken. Alle endpoints geven JSON terug.

Gebruik de werkwijze uit [MySQL in Express.js](../../../mysql/gebruik-in-express.md): zet de verbinding en alle databasefuncties in `database.ts`. Gebruik `mysql2/promise`, `async/await` en `execute()` met placeholders. Registreer `SIGINT` in `connect()` en sluit de verbinding in `exit()`. Zet de routes in een apart routerbestand.
