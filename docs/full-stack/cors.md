# CORS

CORS (Cross-Origin Resource Sharing) is een mechanisme dat wordt gebruikt in webbrowsers om te bepalen of JavaScript de antwoorden van een andere origin mag lezen. Een origin bestaat uit drie onderdelen: het **protocol**, de **domeinnaam** en de **poort**.

In ons voorbeeld draaien de frontend en backend op verschillende origins:

| Applicatie | Origin |
| --- | --- |
| Vite-frontend | `http://localhost:5173` |
| Express-API | `http://localhost:3000` |

De domeinnaam is dezelfde, maar de poort verschilt. Daarom moet de Express-server toestemming geven voordat de browser de antwoorden aan onze frontendcode doorgeeft.

## Waarom bestaat CORS?

Browsers beperken welke antwoorden een script van een andere website kan lezen. Een server kan via CORS aangeven welke origins die toestemming krijgen.

CORS wordt door de browser gecontroleerd. Postman en `curl` passen die controle niet toe. Daarom kan een request in Postman werken terwijl dezelfde fetch in de browser een CORS-fout geeft. CORS vervangt geen login of toegangscontrole op de server.

## CORS instellen in Express.js

Installeer CORS in je **backendproject** `mysql-express`:

```bash
npm install cors
npm install --save-dev @types/cors
```

Voeg bovenaan `index.ts` deze import toe:

```typescript title="index.ts (import)"
import cors, { type CorsOptions } from "cors";
```

Plaats de middleware na het aanmaken van `app` en **vóór de router**. Dit deel van `index.ts` wordt dan:

```typescript title="index.ts (middleware)"
const app: Express = express();

app.set("port", 3000);

const corsOptions: CorsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/planets", planetsRouter());
```

De rest van `index.ts`, met de async functie `main()`, blijft hetzelfde. De databaseverbinding en `exit()` blijven in `database.ts`.

Compileer en herstart de backend na deze wijziging:

```bash
npx tsc
node dist/index.js
```

`origin` is het adres van de **frontend**, niet dat van de API. Gebruik precies dezelfde origin als in de adresbalk van de browser. `http://127.0.0.1:5173` is bijvoorbeeld een andere origin dan `http://localhost:5173`. Ook een andere poort of `https` maakt een verschil.

## Hoe werkt CORS?

Bij `GET /planets` voegt de middleware deze header toe aan het antwoord:

```http
Access-Control-Allow-Origin: http://localhost:5173
```

De browser vergelijkt deze waarde met de origin van de frontend. Als ze overeenkomen, mag onze TypeScript-code het antwoord lezen.

Bij het toevoegen van een planeet sturen we JSON met `Content-Type: application/json`. Hiervoor stuurt de browser eerst een **preflight-request** met de methode `OPTIONS`:

```http
OPTIONS /planets HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

De middleware antwoordt met de toegestane origin, methodes en headers. Als die het verzoek toelaten, verstuurt de browser daarna de POST-request. Omdat we `app.use(cors(corsOptions))` gebruiken, handelt de middleware de OPTIONS-request automatisch af. Je hoeft er geen aparte route voor te schrijven.

## Veelgebruikte CORS-headers

| Header | Betekenis |
| --- | --- |
| `Access-Control-Allow-Origin` | Welke origin het antwoord mag lezen. |
| `Access-Control-Allow-Methods` | Welke HTTP-methodes de browser na de preflight mag gebruiken. |
| `Access-Control-Allow-Headers` | Welke request-headers de browser mag meesturen. |
| `Access-Control-Allow-Credentials` | Of een antwoord met credentials, zoals cookies, beschikbaar mag zijn voor de frontend. Dit gebruiken we niet in dit voorbeeld. |

Met `app.use(cors())` laat je alle origins toe. Voor ons voorbeeld geven we expliciet de Vite-origin op.

## Een CORS-fout oplossen

Controleer of de backend draait, of de origin overeenkomt met je frontend en of `app.use(cors(corsOptions))` vóór de router staat. Start Vite op poort 5173 met `--strictPort`, zoals in het volgende hoofdstuk, zodat Vite niet ongemerkt naar een andere poort overschakelt.

Gebruik niet `mode: "no-cors"` in je fetch als oplossing: dan kan je de JSON-response niet lezen. De toestemming moet op de server ingesteld worden.

Ga verder met [Van form naar database](./vite-planeten.md).
