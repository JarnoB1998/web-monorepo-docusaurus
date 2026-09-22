# CRUD met API-endpoints

CRUD staat voor Create, Read, Update en Delete. We breiden de planeten-applicatie uit zodat we planeten kunnen toevoegen, bekijken, wijzigen en verwijderen.

We bouwen verder op [Gebruik in Express.js](./gebruik-in-express.md). We voegen databasefuncties toe aan `database.ts` en routes aan `routers/planetsRouter.ts`. De andere bestanden blijven hetzelfde.

## Overzicht

| Methode | Endpoint | Bewerking | Geslaagd antwoord |
| --- | --- | --- | --- |
| GET | `/planets` | Alle planeten lezen | `200` met een JSON-array |
| GET | `/planets/:id` | Eén planeet lezen | `200` met een JSON-object |
| POST | `/planets` | Een planeet toevoegen | `201` met het aangemaakte object |
| PATCH | `/planets/:id` | De naam van een planeet wijzigen | `200` met het gewijzigde object |
| DELETE | `/planets/:id` | Een planeet verwijderen | `204` zonder body |

De router verwerkt de request en stuurt de response. De databasefuncties voeren de SQL-queries uit. Alle waarden uit requests geven we via placeholders (`?`) door aan `execute()`.

## Databasefuncties toevoegen

Voeg `ResultSetHeader` toe aan de bestaande import bovenaan `database.ts`:

```typescript title="database.ts (import)"
import mysql, { type Connection, type ConnectionOptions, type FieldPacket, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";
```

De bestaande functies blijven staan. Voeg de volgende functies onderaan `database.ts` toe.

### Eén planeet ophalen

```typescript title="database.ts"
export async function getPlanetById(id: number): Promise<Planet | undefined> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id, name FROM planet WHERE id = ?",
        [id]
    );
    return rows[0] as Planet | undefined;
}
```

Ook wanneer we één rij zoeken, geeft MySQL een array terug. We nemen de eerste rij. Als het id niet bestaat, krijgen we `undefined`.

### Een planeet toevoegen

```typescript title="database.ts"
export async function createPlanet(name: string): Promise<Planet | undefined> {
    const [result]: [ResultSetHeader, FieldPacket[]] = await databaseConnection.execute(
        "INSERT INTO planet (name) VALUES (?)",
        [name]
    );
    return await getPlanetById(result.insertId);
}
```

MySQL maakt het id aan via `AUTO_INCREMENT`. De INSERT-query geeft een `ResultSetHeader` terug met het nieuwe id in `insertId`. We gebruiken `getPlanetById()` om de aangemaakte planeet terug te geven.

### Een planeet wijzigen

```typescript title="database.ts"
export async function updatePlanet(id: number, name: string): Promise<Planet | undefined> {
    await databaseConnection.execute(
        "UPDATE planet SET name = ? WHERE id = ?",
        [name, id]
    );
    return await getPlanetById(id);
}
```

De waarden staan in dezelfde volgorde als de vraagtekens: eerst de naam, daarna het id. Na de UPDATE halen we de planeet opnieuw op. Als het id niet bestaat, geeft de functie `undefined` terug. Als de naam al hetzelfde was, krijgen we nog steeds de bestaande planeet terug.

### Een planeet verwijderen

```typescript title="database.ts"
export async function deletePlanet(id: number): Promise<void> {
    await databaseConnection.execute(
        "DELETE FROM planet WHERE id = ?",
        [id]
    );
}
```

Deze functie verwijdert de planeet met het opgegeven id. Vergeet bij UPDATE en DELETE de `WHERE`-clause niet: zonder die voorwaarde zou je alle rijen wijzigen of verwijderen.

## Routes toevoegen

Pas de imports bovenaan `routers/planetsRouter.ts` aan:

```typescript title="routers/planetsRouter.ts (imports)"
import { Router } from "express";
import type { Planet } from "../types";
import { getPlanets, getPlanetById, createPlanet, updatePlanet, deletePlanet } from "../database";
```

Plaats de volgende routes **in de functie `planetsRouter()`**, na de bestaande GET-route en vóór `return router;`. Omdat de router in `index.ts` al aan `/planets` gekoppeld is, gebruiken we hier alleen `/` en `/:id`.

### Eén planeet ophalen

```typescript title="routers/planetsRouter.ts (GET)"
router.get("/:id", async (req, res): Promise<void> => {
    const id: number = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "Ongeldig id." });
        return;
    }

    const planet: Planet | undefined = await getPlanetById(id);
    if (planet) {
        res.json(planet);
    } else {
        res.status(404).json({ error: "Planeet niet gevonden." });
    }
});
```

We zetten het id uit de URL om naar een getal. Een ongeldig id krijgt `400`. Als de databasefunctie geen planeet vindt, antwoorden we met `404`.

### Een planeet toevoegen

```typescript title="routers/planetsRouter.ts (POST)"
router.post("/", async (req, res): Promise<void> => {
    const name: unknown = req.body?.name;
    if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
        res.status(400).json({ error: "Geef een name van 1 tot 100 tekens." });
        return;
    }

    const planet: Planet | undefined = await createPlanet(name.trim());
    if (!planet) {
        res.status(500).json({ error: "Planeet kon niet worden aangemaakt." });
        return;
    }
    res.status(201).json(planet);
});
```

Dankzij `express.json()` vinden we de JSON-data in `req.body`. We nemen de naam eerst over als `unknown`: de client kan immers ook een getal of niets opsturen. Na de `typeof`-controle weet TypeScript dat `name` een string is.

We geven alleen de naam door aan de databasefunctie. De client bepaalt dus niet zelf het id. Bij succes sturen we `201` met de nieuwe planeet terug.

### Een planeet wijzigen

```typescript title="routers/planetsRouter.ts (PATCH)"
router.patch("/:id", async (req, res): Promise<void> => {
    const id: number = Number(req.params.id);
    const name: unknown = req.body?.name;
    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "Ongeldig id." });
        return;
    }
    if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
        res.status(400).json({ error: "Geef een name van 1 tot 100 tekens." });
        return;
    }

    const planet: Planet | undefined = await updatePlanet(id, name.trim());
    if (planet) {
        res.json(planet);
    } else {
        res.status(404).json({ error: "Planeet niet gevonden." });
    }
});
```

Net zoals in het Harry Potter-project gebruiken we PATCH om een bestaand record aan te passen. Onze planeet heeft maar één wijzigbaar veld: `name`. Daarom vragen we in deze request een naam.

### Een planeet verwijderen

```typescript title="routers/planetsRouter.ts (DELETE)"
router.delete("/:id", async (req, res): Promise<void> => {
    const id: number = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "Ongeldig id." });
        return;
    }

    const planet: Planet | undefined = await getPlanetById(id);
    if (!planet) {
        res.status(404).json({ error: "Planeet niet gevonden." });
        return;
    }
    await deletePlanet(id);
    res.status(204).send();
});
```

We controleren eerst of de planeet bestaat. Na het verwijderen antwoorden we met `204 No Content`. Die response heeft geen body.

## De API testen

Compileer en herstart de server na je wijzigingen:

```bash
npx tsc
node dist/index.js
```

Voer de volgende requests uit in een tweede terminal. Met `-i` zie je ook de HTTP-status en headers. Op Windows kan je hiervoor Git Bash gebruiken.

### Alle planeten opvragen

```bash
curl -i http://localhost:3000/planets
```

### Een planeet toevoegen

```bash
curl -i -X POST http://localhost:3000/planets \
  -H 'Content-Type: application/json' \
  -d '{"name":"Mars"}'
```

Je krijgt status `201`, een `Location`-header en bijvoorbeeld:

```json
{ "id": 3, "name": "Mars" }
```

Het id kan bij jou anders zijn. Gebruik in de volgende requests het id uit jouw response in plaats van `3`.

### Eén planeet opvragen

```bash
curl -i http://localhost:3000/planets/3
```

### De planeet wijzigen

```bash
curl -i -X PATCH http://localhost:3000/planets/3 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jupiter"}'
```

De response krijgt status `200` en bevat de gewijzigde planeet. Voer dezelfde request nog eens uit: ook dan krijg je `200`.

### De planeet verwijderen

```bash
curl -i -X DELETE http://localhost:3000/planets/3
```

Je krijgt status `204` zonder body. Een volgende GET, PATCH of DELETE met hetzelfde id geeft `404`.

### Ongeldige invoer

```bash
curl -i -X POST http://localhost:3000/planets \
  -H 'Content-Type: application/json' \
  -d '{"name":"   "}'

curl -i http://localhost:3000/planets/abc
```

Beide requests geven `400` met een JSON-foutmelding. Herstart tot slot de server en vraag de lijst opnieuw op: de wijzigingen zijn in MySQL opgeslagen en blijven bewaard.

In de volgende hoofdstukken stellen we [CORS](../full-stack/cors.md) in en maken we [een Vite-pagina met een planetenlijst en een formulier](../full-stack/vite-planeten.md).
