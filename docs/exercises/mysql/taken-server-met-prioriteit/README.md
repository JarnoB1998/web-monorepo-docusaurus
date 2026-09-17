---
sidebar_position: 3
---

# Taken server met prioriteit

Kopieer je project van [Taken server](../taken-server/README.md).

Een taak heeft nu een prioriteit. Hoe lager de prioriteit, hoe sneller het opgelost moet worden.

De prioriteit is uniek, het kan dus niet zijn dat een taak eenzelfde prioriteit heeft als een andere taak.

Bij aanmaak van een taak komt deze steeds achteraan het prioriteitenlijstje. Heb je bijvoorbeeld al drie taken met prioriteit 1 , 2 en 3, dan zal de nieuwe taak prioriteit 4 krijgen. Zijn er geen taken, dan krijgt de nieuwe taak prioriteit 1.

Bij `GET /tasks` sorteer je de taken op prioriteit, laagst eerst;

De `GET /task` haalt steeds de prioriteit 1 op.

De `DELETE /task` zal nog steeds een taak weghalen én zorgt ervoor dat de nummering wordt bijgewerkt zodat er geen gat ontstaat.

Voeg nu nog een nieuwe API toe: `POST /task-urgent`. Deze voegt een taak toe met prioriteit 1 en past alle prioriteiten van de andere taken aan.

Gebruik de werkwijze uit [MySQL in Express.js](../../../mysql/gebruik-in-express.md): zet de verbinding en alle databasefuncties in `database.ts`. Gebruik `mysql2/promise`, `async/await` en `execute()` met placeholders. Registreer `SIGINT` in `connect()` en sluit de verbinding in `exit()`. Zet de routes in een apart routerbestand.

Test het toevoegen, dringend toevoegen en uitvoeren van taken. Controleer na elke wijziging of de prioriteiten uniek zijn en zonder onderbreking van `1` tot het aantal taken lopen.
