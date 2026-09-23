---
sidebar_position: 1
---

# Reiskosten app

Vertrek van dit [starterproject](/exercise-files/full-stack/reiskosten-app/starter.zip) voor de client. Het bevat de HTML en CSS; de TypeScript-code werk je zelf uit.

Maak twee projecten aan : reiskosten-client en reiskosten-server.

Gebruik de server uit [Reiskosten server met MySQL](../../mysql/reiskosten-server/README.md).

De reiskosten-client is een Vite project.

Voorzie in je client :

* formulier om een nieuwe reis in te voeren
* formulier om voor één reis de kosten in te voeren
* tabel van al je reizen
* tabel van de kosten van één reis

**Tips:**

* Maak eerst je reizen tabel en de form om een reis in te voeren
* Zorg vervolgens voor een functie die kan detecteren op welke reis je klikt, kijk voor inspiratie hier eens : [https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tr_rowindex](https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tr_rowindex)
*  Als je op een reis hebt geklikt, dan zou je de kostentabel en formulier zichtbaar kunnen maken of naar een andere pagina gaan. Als je een element zichtbaar wilt maken, dat kan je op deze manier doen : [https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp](https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp)

## Werkwijze

Werk met een apart Vite-project voor de client en een Express-project voor de server, zoals in [Van form naar database](../../../full-stack/vite-planeten.md). Geef je interfaces, functies en DOM-selectors de juiste TypeScript-types. Configureer [CORS](../../../full-stack/cors.md) zodat de client op `http://localhost:5173` de API op `http://localhost:3000` kan aanspreken. Alle endpoints geven JSON terug.

Gebruik de werkwijze uit [MySQL in Express.js](../../../mysql/gebruik-in-express.md): zet de verbinding en alle databasefuncties in `database.ts`. Gebruik `mysql2/promise`, `async/await` en `execute()` met placeholders. Registreer `SIGINT` in `connect()` en sluit de verbinding in `exit()`. Zet de routes in een apart routerbestand.
