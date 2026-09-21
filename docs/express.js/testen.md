# Express testen

Nu je weet hoe je Node.js functies test met [Vitest](../nodejs-+-typescript/testing.md), kan je ook je Express routes testen. Hiervoor gebruik je de [supertest](https://github.com/forwardemail/supertest) library, die het mogelijk maakt om HTTP requests te versturen naar een Express applicatie en de response te testen. Vitest voert de tests uit en levert de functies `describe`, `it` en `expect`.

We moeten deze dan ook nog installeren:

```bash
npm i --save-dev vitest supertest @types/supertest
```

Gebruik het bestaande `test`-script als je project met `create-clean-node` is aangemaakt. Dat controleert eerst de TypeScript-types en voert daarna Vitest uit. Als je nog geen testscript hebt, voeg je dit toe aan het `scripts`-object in `package.json`:

```json
{
    "scripts": {
        "test": "vitest run"
    }
}
```

### De app en de server scheiden

Stel dat we een Express applicatie hebben die een GET request afhandelt op de route `/hello`. Zet de app en de routes in `app.ts` en exporteer de app:

```typescript
import express from "express";

const app = express();

app.get("/hello", (req, res) => {
    res.send("Hello, world!");
});

export default app;
```

Start de server alleen in `index.ts`:

```typescript
import app from "./app.ts";

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
```

De tests importeren `app.ts`. Zo starten ze niet bij elke import een server op poort 3000 die na de tests blijft luisteren. Supertest opent zelf tijdelijk een poort voor de requests en sluit die na afloop. Je hoeft de applicatie dus niet eerst met `npm start` te starten.

### Een route testen

Maak een bestand `app.test.ts` naast `app.ts`:

```typescript
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "./app.ts";

describe("GET /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, world!");
    });
});
```

Met `await` wacht de test op de response voordat de statuscode en de tekst gecontroleerd worden. Voer de tests één keer uit met:

```bash
npm test
```

### Query parameters

Vervang voor dit voorbeeld de bestaande GET-route in `app.ts` door een route die een query parameter verwacht:

```typescript
app.get("/hello", (req, res) => {
    const name = req.query.name;
    res.send(`Hello, ${name}!`);
});
```

Vervang de inhoud van `app.test.ts` door de bijbehorende tests. Met `.query()` geef je de query parameters mee:

```typescript
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "./app.ts";

describe("GET /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).get("/hello").query({ name: "world" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, world!");
    });

    it("should return Hello, John!", async () => {
        const response = await request(app).get("/hello").query({ name: "John" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, John!");
    });
});
```

### POST requests

Voeg voor POST requests de volgende code toe aan `app.ts`, vóór `export default app`. Met `.send()` verstuurt Supertest een object als JSON. Daarom moet `express.json()` vóór de POST-route geregistreerd worden, zodat Express `req.body` kan uitlezen:

```typescript
app.use(express.json());

app.post("/hello", (req, res) => {
    const name = req.body.name;
    res.send(`Hello, ${name}!`);
});
```

De bijbehorende tests in `app.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "./app.ts";

describe("POST /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).post("/hello").send({ name: "world" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, world!");
    });

    it("should return Hello, John!", async () => {
        const response = await request(app).post("/hello").send({ name: "John" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, John!");
    });
});
```

### HTML responses

Vervang voor dit voorbeeld de bestaande GET-route in `app.ts` door een route die HTML teruggeeft:

```typescript
app.get("/hello", (req, res) => {
    res.send("<h1>Hello, world!</h1>");
});
```

en de test:

```typescript
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "./app.ts";

describe("GET /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        expect(response.text).toBe("<h1>Hello, world!</h1>");
    });
});
```

Of je kan de HTML parsen met `node-html-parser` en dan de inhoud van de h1 tag testen. Installeer daarvoor eerst de parser:

```bash
npm i --save-dev node-html-parser
```

Gebruik vervolgens deze test in `app.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import request from "supertest";
import { parse } from "node-html-parser";
import app from "./app.ts";

describe("GET /hello", () => {
    it("should return Hello, world!", async () => {
        const response = await request(app).get("/hello");
        expect(response.status).toBe(200);
        const root = parse(response.text);
        const h1 = root.querySelector("h1");
        expect(h1).not.toBeNull();
        expect(h1?.innerText).toBe("Hello, world!");
    });
});
```

Door ook te controleren dat `h1` bestaat, faalt de test wanneer de tag ontbreekt. Met alleen een `if (h1)` zou die controle worden overgeslagen en zou de test onterecht slagen.
