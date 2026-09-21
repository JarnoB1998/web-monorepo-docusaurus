# Mocking

Unit testen wordt vaak lastiger wanneer je code interageert met "de buitenwereld", zoals een databank. Met een **mock** vervang je zo'n afhankelijkheid door vooraf bepaald gedrag. Zo kan je de code testen zonder een echte databank en achteraf controleren welke functies werden aangeroepen. Vitest biedt hiervoor onder andere `vi.mock`, `vi.fn` en `vi.spyOn`.

## Database

Door de databasecode in een aparte module te zetten, kan je de Express-routes en de databasefuncties afzonderlijk testen. Voor de voorbeelden gebruiken we Vitest en Supertest, zoals in het hoofdstuk [Express testen](../express.js/testen.md).

In een Express-project heb je de volgende packages nodig:

```bash
npm i mongodb ejs
npm i --save-dev vitest supertest @types/supertest
```

Gebruik het bestaande `test`-script van `create-clean-node`, of het `vitest run`-script uit het hoofdstuk Express testen.

### De database en de app

Een eenvoudige `database.ts` exporteert de collection en de functie `getPets`:

```typescript
import { MongoClient } from "mongodb";

export interface Pet {
    name: string;
    species: string;
}

const client = new MongoClient("mongodb://localhost:27017");
export const collection = client.db("exercises").collection<Pet>("pets");

export async function getPets(): Promise<Pet[]> {
    return await collection.find({}).toArray();
}
```

Roep bij het importeren van deze module geen `connect()` of seedfunctie aan. Het aanmaken van een client en een collection voert nog geen databasequery uit. Het opstarten van de server en eventuele expliciete databaseverbindingen horen in `index.ts`, zoals uitgelegd in [Express testen](../express.js/testen.md).

De route in `app.ts` gebruikt `getPets` en rendert het resultaat met EJS:

```typescript
import express from "express";
import path from "node:path";
import { getPets } from "./database.ts";

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

app.get("/pets", async (req, res) => {
    try {
        const pets = await getPets();
        res.render("pets", { pets });
    } catch {
        res.status(500).send("Dieren ophalen mislukt");
    }
});

export default app;
```

Maak hiervoor ook `views/pets.ejs`:

```ejs
<h1>Dieren</h1>
<% if (pets.length === 0) { %>
    <p>Geen dieren gevonden.</p>
<% } %>
<ul>
    <% for (const pet of pets) { %>
        <li><%= pet.name %> (<%= pet.species %>)</li>
    <% } %>
</ul>
```

### De database.ts-module mocken

Voor een routetest vervangen we de volledige database-module met `vi.mock`. De route krijgt daardoor een mock van `getPets` in plaats van de echte functie. Zet de volgende tests in `app.test.ts`:

```typescript
import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { getPets } from "./database.ts";
import app from "./app.ts";

vi.mock(import("./database.ts"), () => ({
    getPets: vi.fn(),
}));

const getPetsMock = vi.mocked(getPets);

beforeEach(() => {
    getPetsMock.mockReset();
});

describe("GET /pets", () => {
    it("should display the pets returned by the database module", async () => {
        const mockPets = [
            { name: "Fido", species: "dog" },
            { name: "Milo", species: "cat" },
        ];
        getPetsMock.mockResolvedValue(mockPets);

        const response = await request(app).get("/pets");

        expect(response.status).toBe(200);
        expect(response.text).toContain("Fido (dog)");
        expect(response.text).toContain("Milo (cat)");
        expect(getPetsMock).toHaveBeenCalledExactlyOnceWith();
    });

    it("should display a message when there are no pets", async () => {
        getPetsMock.mockResolvedValue([]);

        const response = await request(app).get("/pets");

        expect(response.status).toBe(200);
        expect(response.text).toContain("Geen dieren gevonden.");
        expect(getPetsMock).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return 500 when the database module rejects", async () => {
        getPetsMock.mockRejectedValue(new Error("Database niet bereikbaar"));

        const response = await request(app).get("/pets");

        expect(response.status).toBe(500);
        expect(response.text).toBe("Dieren ophalen mislukt");
        expect(getPetsMock).toHaveBeenCalledExactlyOnceWith();
    });
});
```

Vitest voert `vi.mock` vóór de imports uit. Dit heet **hoisting**. Met deze factory wordt de oorspronkelijke `database.ts` niet uitgevoerd: zowel de app als de test krijgen dezelfde mock van `getPets`. Maak de mock daarom binnen de factory met `vi.fn()` en stel de testdata daarna per test in. Als je app meer exports uit de module gebruikt, moet je die ook in de factory voorzien.

`vi.mocked(getPets)` helpt TypeScript om de functie als mock te behandelen; het maakt zelf geen mock. `mockResolvedValue` levert een geslaagde Promise, terwijl `mockRejectedValue` een afgewezen Promise oplevert. De tests controleren zowel de HTTP-response als de aanroep van `getPets` zonder argumenten. De echte MongoDB-driver wordt bij deze routetests niet aangeroepen.

### De databasefunctie zelf testen

Wil je de implementatie van `getPets` testen, dan moet die functie echt uitgevoerd worden. In een apart bestand `database.test.ts` mocken we daarom alleen de databasebewerking met `vi.spyOn`:

```typescript
import { afterEach, expect, test, vi } from "vitest";
import { ObjectId } from "mongodb";
import { collection, getPets } from "./database.ts";

afterEach(() => {
    vi.restoreAllMocks();
});

test("getPets should retrieve all pets from the collection", async () => {
    const mockPets = [
        { _id: new ObjectId(), name: "Fido", species: "dog" },
        { _id: new ObjectId(), name: "Milo", species: "cat" },
    ];
    const cursor = collection.find({});
    const toArrayMock = vi.spyOn(cursor, "toArray").mockResolvedValue(mockPets);
    const findMock = vi.spyOn(collection, "find").mockReturnValue(cursor);

    const pets = await getPets();

    expect(pets).toEqual(mockPets);
    expect(findMock).toHaveBeenCalledExactlyOnceWith({});
    expect(toArrayMock).toHaveBeenCalledExactlyOnceWith();
});
```

`find()` maakt een cursor aan; de data wordt pas opgehaald wanneer je die cursor uitleest, bijvoorbeeld met `toArray()`. Hier vervangen we `toArray()` voordat dat gebeurt. `getPets` krijgt via de gemockte `find()` diezelfde cursor terug. Zo behouden we de types van de MongoDB-driver zonder `as any` en voeren we geen echte query uit. De voorbeeldgegevens bevatten ook de `_id` die de driver bij opgehaalde documenten verwacht.

Bewaar deze test in een ander bestand dan de routetests. Daar vervangen we immers de hele module. Vitest isoleert testbestanden standaard, zodat `database.test.ts` de echte implementatie kan testen.

## Mocks opruimen

`mockReset()` wist bij onze `vi.fn()` zowel de aanroepgeschiedenis als het ingestelde gedrag. Daarom stelt elke routetest opnieuw zijn eigen resultaat in. Alleen `mockClear()` gebruiken zou de ingestelde response of fout behouden.

Bij `vi.spyOn` gebruiken we `vi.restoreAllMocks()` na elke test om de oorspronkelijke methodes terug te zetten. Dit verwijdert niet de modulevervanging die met `vi.mock` is ingesteld; die blijft actief binnen het betreffende testbestand.

Voer beide testbestanden uit met:

```bash
npm test -- app.test.ts database.test.ts
```

Voor deze tests hoef je geen MongoDB-server te starten. Meer uitleg vind je in de [Vitest-documentatie over module-mocking](https://vitest.dev/guide/mocking/modules).
