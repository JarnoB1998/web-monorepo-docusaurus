# MySQL

MySQL is een open-source relationeel database management systeem, of ook wel RDBMS genoemd.

* open source, maar wel eigendom van Oracle
* relationele database : werkt met tabellen en de query taal SQL.
* database management systeem : ook alle software die nodig is om de database aan te spreken wordt in het MySQL ecosysteem aangeleverd.

:::tip Fun fact
De oorspronkelijke bedenker van MySQL heeft een variant uitgebracht MariaDB o.a. uit protest tegen de overname door Oracle.
:::

## Installatie

Om met MySQL aan de slag te gaan moet je deze installeren. Kies voor de MySQL community edition. Je kan je het leven makkelijker maken door ook de MySQL workbench te installeren. Met de workbench kan je makkelijk je schema's en tabellen opvragen.

En dan moeten we uiteraard in ons node project ook nog MySQL installeren. Dit doe je met het command:

```bash
npm install mysql2
```

:::warning
**Opgelet !** Gebruik de **mysql2** library en niét de mysql library. De mysql library is verouderd !!
:::

Vergeet zeker niet je node types te installeren om fouten te vermijden.

```bash
npm install -D @types/node
```

## Voorbeeldproject

Maak een Node.js-project aan met de naam `mysql-planeten`. We werken eerst met scripts in de terminal. Gebruik de volgende configuratie voor `tsconfig.json`:

```json title="tsconfig.json"
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "commonjs",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "outDir": "dist"
    },
    "include": ["*.ts"]
}
```

```bash
npm init -y
npm install --save-dev typescript@5.6.3 @types/node
```

Maak in MySQL Workbench een schema en een tabel aan. Voer hiervoor dit SQL-script uit:

```sql title="schema.sql"
CREATE DATABASE IF NOT EXISTS webontwikkeling;
USE webontwikkeling;

CREATE TABLE IF NOT EXISTS planet (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO planet (name) VALUES ('Earth'), ('Venus');
```

Voer de `INSERT` voor de startgegevens één keer uit. De voorbeelden gebruiken telkens dezelfde tabel `planet`, met een automatisch gegenereerd `id` en een `name`.

## Connecteren

De eerste stap is connecteren vanuit je node server naar je database.

Hier moeten we twee zaken voor doen: connectie opties definiëren en de connectie aanmaken.

### Connection options

Om de connectie op te zetten moeten we weten waar je database draait en met welke gegevens we kunnen aanloggen.

```typescript title="config.ts"
import type { ConnectionOptions } from "mysql2";

export const access: ConnectionOptions = {
    host: "localhost",
    user: "root",
    password: "<jouwrootwachtwoord>",
    database: "webontwikkeling"
};
```

We beginnen met de connection options aan te maken. `ConnectionOptions` is een datatype dat je importeert van de mysql2 library. Dit datatype bevat de mogelijke opties voor de connectie. Enkele belangrijke opties zijn:

* host : de URL waar je database server draait. In development zal dat waarschijnlijk je eigen machine zijn, dus 'localhost'.
* user : de gebruiker waarmee je connecteert. In development is dat meestal de 'root' user.
* password : het wachtwoord waarmee die user connecteert.
* database : de database waarnaartoe je connecteert, dit is de schema naam die je hebt aangemaakt in MySQL. Let op dat je user rechten moet hebben om dit schema aan te spreken.

`connectionLimit` hoort bij een connection pool, niet bij één `Connection`. Daarom laten we die optie hier weg.

Bewaar de opties in `config.ts` en vul je eigen lokale aanmeldgegevens in. De volgende stap is de connectie aanmaken met deze opties.

```typescript title="connectie.ts"
import mysql, { Connection } from "mysql2";
import { access } from "./config";

const conn: Connection = mysql.createConnection(access);
conn.end();
```

Met het createConnection commando maak je een connectie van datatype Connection aan. Merk op dat je je ConnectionOptions als parameter mee geeft aan deze functie. Dit korte voorbeeld sluit de connectie meteen weer; in de volgende voorbeelden voeren we eerst een query uit.

Er zijn nu twee manieren om verder te werken : via callback of promise

### Query met callback

Na het aanmaken van de connectie, kunnen we deze gebruiken om queries uit te voeren.

We geven de rijen een eigen type. `RowDataPacket` is het basistype dat `mysql2` gebruikt voor een rij uit een SELECT-query.

```typescript title="types.ts"
import type { RowDataPacket } from "mysql2";

export interface Planet extends RowDataPacket {
    id: number;
    name: string;
}
```

Een select query met callback, wordt als volgt opgezet:

```typescript title="callback.ts"
import mysql, { Connection, QueryError } from "mysql2";
import { access } from "./config";
import { Planet } from "./types";

const conn: Connection = mysql.createConnection(access);

conn.query<Planet[]>("SELECT id, name FROM planet", (error: QueryError | null, result: Planet[]): void => {
    if (error) {
        console.error(error);
        process.exitCode = 1;
    } else {
        console.log(result);
    }
    conn.end();
});
```

Gebruik de query functie van de connection en geef twee parameters mee: de query en een callback function. De callback function heeft twee parameters: error en results.

In de callback zet je best eerst een controle op je error. Bij een geslaagde query is `error` gelijk aan `null`. Er kan best wel wat mislopen bij het query-en van je database dus deze controle is nodig om die fouten op te vangen.

Het result object zal het resultaat van je query bevatten. In geval van een select is dit een array van records.

Andere soorten query, zoals insert of delete, worden op dezelfde manier uitgevoerd.

### Query met promise

De ondersteuning voor promise (async / await) werd pas later toegevoegd aan de mysql2 library. Hierdoor moeten we een andere import gebruiken als we met promise willen werken

De select query schrijven we dan als volgt:

```typescript title="promise.ts"
import mysql, { Connection } from "mysql2/promise";
import { Planet } from "./types";
import { access } from "./config";

async function run(): Promise<void> {
    let conn: Connection | undefined;
    try {
        conn = await mysql.createConnection(access);
        const [result, fields] = await conn.query<Planet[]>("SELECT id, name FROM planet");
        console.log(result);
        console.log(fields);
    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await conn?.end();
    }
}

run();
```

:::warning
Opgelet ! Gebruik de import ***mysql2/promise*** om met async / await aan de slag te gaan !
:::

Als we met promise werken zorgen we uiteraard eerst voor een async function waar de await statements in kunnen gezet worden.

Een query via promise geeft een tuple terug van result en fields. Je kan ook de fields weg laten zodat je enkel \[result] opvangt. Maar het is steeds een tuple, zelfs als je enkel interesse hebt in het result.

De result bevat, net zoals bij de callback, de resultaatslijnen van je query.

:::tip
Laat in dit geval het type maar weg. Door type inference kent TypeScript het tuple-type. Met de generic `Planet[]` geven we wel expliciet het type van de rijen mee. De `fields` bevatten metadata over de kolommen. Deze types controleren je TypeScript-code, niet de inhoud of structuur van je database tijdens het uitvoeren.
:::

Errorhandling dienen we bij de promise te doen via de try / catch methode want in tegenstelling tot de callback krijgen we daar geen error object terug. De promise query zal een throw doen van de error die we dus opvangen met een try / catch.

### SELECT met WHERE clause

In veel gevallen zal je SELECT query een WHERE clause bevatten en in de voorbeelden vergelijken we string interpolatie met een prepared statement. Gebruik voor waarden die van buiten je code komen altijd een prepared statement.

#### WHERE clause met string interpolatie

:::warning
Dit voorbeeld toont waarom je string interpolatie voor SQL-waarden moet vermijden. Een apostrof in een naam kan de query breken, en gebruikersinvoer kan SQL-injectie veroorzaken. Gebruik de variant met `execute()` hieronder in je applicaties.
:::

```typescript title="select-interpolatie.ts"
import mysql, { Connection } from "mysql2/promise";
import { Planet } from "./types";
import { access } from "./config";

async function run(myname: string): Promise<void> {
    let conn: Connection | undefined;
    try {
        conn = await mysql.createConnection(access);
        const [result] = await conn.query<Planet[]>(`SELECT id, name FROM planet WHERE name = '${myname}'`);
        console.log(result);
    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await conn?.end();
    }
}

run('Earth');
```

Door string interpolatie kunnen we de parameters van de clause makkelijk toevoegen aan de query.

#### WHERE clause met prepared statement

```typescript title="select.ts"
import mysql, { Connection } from "mysql2/promise";
import { Planet } from "./types";
import { access } from "./config";

async function run(myname: string): Promise<void> {
    let conn: Connection | undefined;
    try {
        conn = await mysql.createConnection(access);
        const [result] = await conn.execute<Planet[]>("SELECT id, name FROM planet WHERE name = ?", [myname]);
        console.log(result);
    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await conn?.end();
    }
}

run('Earth');
```

Met `execute()` laat je `mysql2` een prepared statement uitvoeren. `query()` met placeholders kan waarden ook escapen, maar maakt geen server-side prepared statement.

Bij de prepared statement methode plaatsen we in de where clause een "?" op de plaats waar een parameter ingevuld dient te worden. Vervolgens wordt een array van waardes meegegeven en deze waardes worden ingevuld op de plaats van het "?". Heb je meer dan één "?" in de where clause staan, dan wordt in het eerste "?" de eerste waarde van array gezet en in het tweede "?" de tweede van de array enzovoort.

### INSERT

Een INSERT query kan eveneens en dit volgt hetzelfde stramien als een SELECT query. We vergelijken opnieuw string interpolatie met een prepared statement voor het doorgeven van de parameters. Gebruik ook hier de prepared statement in je applicatie.

Voorbeeld met string interpolatie, met hetzelfde risico op SQL-injectie als hierboven:

```typescript title="insert-interpolatie.ts"
import mysql, { Connection } from "mysql2/promise";
import type { ResultSetHeader } from "mysql2";
import { access } from "./config";

async function run(myname: string): Promise<void> {
    let conn: Connection | undefined;
    try {
        conn = await mysql.createConnection(access);
        const [result] = await conn.query<ResultSetHeader>(`INSERT INTO planet (name) VALUES ('${myname}')`);
        console.log(result);
    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await conn?.end();
    }
}

run('Mars');
```

Voorbeeld met prepared statement

```typescript title="insert.ts"
import mysql, { Connection } from "mysql2/promise";
import type { ResultSetHeader } from "mysql2";
import { access } from "./config";

async function run(myname: string): Promise<void> {
    let conn: Connection | undefined;
    try {
        conn = await mysql.createConnection(access);
        const [result] = await conn.execute<ResultSetHeader>("INSERT INTO planet (name) VALUES (?)", [myname]);
        console.log(result);
    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await conn?.end();
    }
}

run('Mars');
```

Een INSERT geeft geen array van rijen terug. Daarom gebruiken we de generic `ResultSetHeader`. `result.insertId` bevat het automatisch gegenereerde id en `result.affectedRows` het aantal toegevoegde rijen. Door `(name)` expliciet op te geven, laten we MySQL het `id` invullen.

Je kan elk voorbeeld apart compileren en uitvoeren. Bijvoorbeeld:

```bash
npx tsc
node dist/select.js
node dist/insert.js
```

## Connectie Afsluiten

Elke keer dat je `mysql2` gebruikt om verbinding te maken met een MySQL-server, opent je applicatie een connectie. Elke open connectie neemt een stukje van de serverbronnen in beslag. Als je die connecties **niet afsluit**, kunnen de volgende problemen ontstaan:

* **Geheugenlekken**: openstaande connecties blijven bestaan en gebruiken geheugen, zelfs als ze niet meer nodig zijn.
* **Connectie-limiet overschrijden**: MySQL heeft een maximumaantal gelijktijdige connecties. Niet-afgesloten connecties kunnen ervoor zorgen dat nieuwe verzoeken geen verbinding meer kunnen maken.
* **Onvoorspelbaar gedrag**: foutmeldingen of vertragingen kunnen optreden wanneer het systeem probeert een oude of inactieve connectie te hergebruiken.

Wanneer je webapplicatie wordt afgesloten, is het dus belangrijk om de connectie met de database ook af te sluiten. Hiervoor kunnen we gebruik maken van process signals.

De signalen `SIGINT` en `SIGTERM` kunnen we opvangen om de connectie af te sluiten. `SIGINT` geeft bijvoorbeeld aan dat de gebruiker `CTRL+C` gebruikt om de terminal te beëindigen. `SIGKILL` kan je niet opvangen. In een kort Node.js-script sluiten we de connectie in `finally`, zoals in de voorbeelden hierboven.

### Connection Script

Wat we dus eigenlijk willen is een `connect()`  functie die een database connection teruggeeft, en tegelijk regelt dat de connectie wordt afgesloten wanneer de webapplicatie wordt afgesloten.

Het volgende script definieert een functie `connect()` , waarin een connection wordt gemaakt en teruggegeven. Wanneer de gebruiker het process afsluit (`SIGINT`), dan wordt de functie `exit()` aangeroepen, waarin de connectie terug wordt afgesloten.

De functie `connect()` kan zo gebruikt worden om een connectie te hergebruiken binnen een Node.js-script. We exporteren ook `close()` zodat het script na zijn werk zelf kan afsluiten. Wacht met `await` op `end()` om lopende queries af te werken.

```typescript title="dbconnect.ts"
import mysql, { Connection } from "mysql2/promise";
import { access } from "./config";

let connection: Connection | undefined;

export async function close(): Promise<void> {
    await connection?.end();
    connection = undefined;
}

async function exit(): Promise<void> {
    try {
        await close();
        console.log("disconnected from database");
    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    }
}

process.once("SIGINT", exit);
process.once("SIGTERM", exit);

export async function connect(): Promise<Connection> {
    if (connection) {
        return connection;
    }
    connection = await mysql.createConnection(access);
    return connection;
}
```


Gebruik de module als volgt:

```typescript title="index.ts"
import { Connection } from "mysql2/promise";
import { connect, close } from "./dbconnect";
import { Planet } from "./types";

async function main(): Promise<void> {
    try {
        const conn: Connection = await connect();
        const [planets] = await conn.execute<Planet[]>(
            "SELECT id, name FROM planet WHERE name = ?",
            ["Earth"]
        );
        console.log(planets);
    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await close();
    }
}

main();
```

```bash
npx tsc
node dist/index.js
```

In het volgende hoofdstuk gebruiken we dezelfde tabel in [Express.js](./gebruik-in-express.md). Daar bewaren we de verbinding in een database-module en gebruiken we die vanuit onze routes.
