# Gebruik in Express.js

Tot nu toe hebben we MySQL gebruikt in een Node.js-applicatie. Nu gebruiken we dezelfde database in Express.js. We volgen de werkwijze van het [Harry Potter-project](https://github.com/similonap/harry-potter-express): één database-module met functies voor de queries en een aparte router die deze functies aanroept.

We gebruiken de tabel `planet` uit het [vorige hoofdstuk](./nodejs.md#voorbeeldproject). De routes geven hun gegevens terug als JSON.

## Project aanmaken

Maak een nieuw project `mysql-express` aan:

```bash
npm init -y
npm install express@5 mysql2 dotenv
npm install --save-dev typescript@5.6.3 @types/node @types/express@5
```

De bestanden worden als volgt ingedeeld:

```text
mysql-express/
├── index.ts
├── database.ts
├── types.ts
├── planets.json
├── routers/
│   └── planetsRouter.ts
├── .env
├── package.json
└── tsconfig.json
```

* `index.ts` maakt de Express-applicatie aan en koppelt de router.
* `database.ts` maakt de verbinding en bevat de functies die SQL uitvoeren.
* `types.ts` bevat de interface `Planet`.
* `planets.json` bevat de startgegevens.
* `routers/planetsRouter.ts` bevat de endpoints voor planeten.

Gebruik deze TypeScript-configuratie. Met `resolveJsonModule` kunnen we de startgegevens importeren uit een JSON-bestand.

```json title="tsconfig.json"
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "commonjs",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "outDir": "dist"
    },
    "include": ["*.ts", "routers/**/*.ts"]
}
```

## Types en startgegevens

```typescript title="types.ts"
export interface Planet {
    id: number;
    name: string;
}
```

```json title="planets.json"
[
    { "id": 1, "name": "Earth" },
    { "id": 2, "name": "Venus" }
]
```

Maak het schema `webontwikkeling` aan in MySQL Workbench als dat nog niet bestaat:

```sql
CREATE DATABASE IF NOT EXISTS webontwikkeling;
```

De tabel en startgegevens maken we straks vanuit onze database-module aan.

## Aanmeldgegevens

Plaats je lokale aanmeldgegevens in `.env`:

```dotenv title=".env"
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=jouwrootwachtwoord
DB_NAME=webontwikkeling
```

Voeg `.env`, `node_modules/` en `dist/` toe aan `.gitignore`. Meer uitleg vind je bij [omgevingsvariabelen](../security/environment-variables.md).

## Database module

We bewaren één verbinding in `databaseConnection`. Alle databasefuncties gebruiken diezelfde verbinding.

```typescript title="database.ts"
import mysql, { Connection, ConnectionOptions, FieldPacket, RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";
import initialPlanets from "./planets.json";
import { Planet } from "./types";

dotenv.config();

const access: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? "3306"),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "webontwikkeling"
};

let databaseConnection: Connection;

export async function getPlanets(): Promise<Planet[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id, name FROM planet ORDER BY id"
    );
    return rows as Planet[];
}

export async function seedDatabase(): Promise<void> {
    await databaseConnection.execute(`
        CREATE TABLE IF NOT EXISTS planet (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        )
    `);

    const planets: Planet[] = await getPlanets();
    if (planets.length === 0) {
        for (const planet of initialPlanets) {
            await databaseConnection.execute(
                "INSERT INTO planet (id, name) VALUES (?, ?)",
                [planet.id, planet.name]
            );
        }
        console.log("Database gevuld met de startgegevens.");
    }
}

async function exit(): Promise<void> {
    try {
        await databaseConnection.end();
        console.log("Disconnected from database");
    } catch (error: unknown) {
        console.error(error);
        process.exit(1);
    }
    process.exit(0);
}

export async function connect(): Promise<void> {
    try {
        databaseConnection = await mysql.createConnection(access);
        await seedDatabase();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error: unknown) {
        await databaseConnection?.end();
        throw error;
    }
}
```

`connect()` maakt eerst de verbinding en roept daarna `seedDatabase()` aan. Die functie maakt de tabel aan als ze nog niet bestaat en voegt de startgegevens toe als de tabel leeg is. Bestaande planeten blijven bewaard. Als je alle planeten verwijdert en de applicatie herstart, worden de startgegevens opnieuw toegevoegd.

Net zoals bij MongoDB staat `exit()` in `database.ts` en registreren we die functie met `process.on("SIGINT", exit)` in `connect()`. Wanneer je `CTRL+C` gebruikt, sluit `exit()` de verbinding met `await databaseConnection.end()` en stopt ze daarna het proces. Ook als het opstarten mislukt, sluit de database-module de eventuele verbinding af.

`getPlanets()` haalt de rijen op. `mysql2` geeft een tuple terug met de rijen en informatie over de kolommen. We vangen alleen de rijen op. Met `as Planet[]` vertellen we TypeScript welke vorm de rijen hebben. Dit is een type assertion: TypeScript controleert hiermee niet of je SQL-query werkelijk deze kolommen teruggeeft. Zorg dus dat de query en de interface overeenkomen.

De router krijgt gewoon een array van planeten terug en hoeft niets te weten over de databaseverbinding.

## Router aanmaken

Maak een map `routers` met daarin `planetsRouter.ts`. De functie `planetsRouter()` maakt een router aan en geeft die terug.

```typescript title="routers/planetsRouter.ts"
import { Router } from "express";
import { getPlanets } from "../database";
import { Planet } from "../types";

export function planetsRouter(): Router {
    const router: Router = Router();

    router.get("/", async (req, res): Promise<void> => {
        const planets: Planet[] = await getPlanets();
        res.json(planets);
    });

    return router;
}
```

De route haalt de planeten op via `getPlanets()` en verstuurt ze met `res.json()`. TypeScript leidt de types van `req` en `res` af uit `router.get()`.

## Express-applicatie starten

In `index.ts` koppelen we de router aan `/planets`. De route `/` uit de router is daardoor bereikbaar als `GET /planets`.

```typescript title="index.ts"
import express, { Express } from "express";
import { connect } from "./database";
import { planetsRouter } from "./routers/planetsRouter";

const app: Express = express();

app.set("port", 3000);
app.use(express.json());
app.use("/planets", planetsRouter());

async function main(): Promise<void> {
    try {
        await connect();
        app.listen(app.get("port"), (): void => {
            console.log("Server gestart op http://localhost:" + app.get("port"));
        });
    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    }
}

main();
```

In de async functie `main()` wachten we met `await connect()` tot de verbinding en startgegevens klaar zijn. Daarna starten we de server met `app.listen()`.

Dit voorbeeld gebruikt Express 5. Onverwachte fouten in async routes worden door de standaardfoutafhandeling van Express verwerkt.

De database-module handelt `CTRL+C` af. We sluiten de verbinding niet na elke request: de volgende request gebruikt die opnieuw.

## Uitvoeren

```bash
npx tsc
node dist/index.js
```

Open `http://localhost:3000/planets` in je browser of gebruik:

```bash
curl http://localhost:3000/planets
```

Met alleen de startgegevens krijg je:

```json
[
    { "id": 1, "name": "Earth" },
    { "id": 2, "name": "Venus" }
]
```

In het volgende hoofdstuk voegen we [CRUD-endpoints](./crud-api.md) toe aan dezelfde router en database-module.
