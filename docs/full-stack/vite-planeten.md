# Van form naar database

We zetten de volledige communicatie op van HTML-formulier naar MySQL-database. Hiervoor gebruiken we de technologieën uit de vorige hoofdstukken:

* Vite
* DOM-manipulatie
* Fetch en JSON
* Node.js en Express
* MySQL

We maken een eenvoudige pagina met een lijst van planeten en een formulier om een planeet toe te voegen. De frontend gebruikt de [bestaande CRUD-API](../mysql/crud-api.md): `GET /planets` om de lijst op te halen en `POST /planets` om een planeet toe te voegen.

Zorg dat MySQL en de Express-server draaien en stel eerst [CORS](./cors.md) in op de backend.

## Stap 1: Vite-project opzetten

Maak naast je backend een apart Vite-project met de Vanilla TypeScript-template:

```bash
npm create vite@latest planeten-client -- --template vanilla-ts
cd planeten-client
npm install
```

Heb je meer info nodig, kijk dan terug naar [de uitleg over Vite](../frontend/vite.md).

We gebruiken alleen `index.html`, `src/main.ts` en `src/style.css` voor onze pagina. Vervang de inhoud van deze bestanden door de voorbeelden hieronder.

## Stap 2: Lijst en formulier aanmaken

Maak in `index.html` een lege lijst en een formulier met één naamveld:

```html title="index.html"
<!doctype html>
<html lang="nl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Planeten</title>
</head>
<body>
    <main>
        <h1>Planeten</h1>
        <ul id="planet-list"></ul>

        <h2>Planeet toevoegen</h2>
        <form id="planet-form">
            <label for="name">Naam:</label>
            <input type="text" id="name" name="name" maxlength="100" required />
            <button type="submit" id="add-button" disabled>Toevoegen</button>
        </form>
        <p id="message" role="status"></p>
    </main>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

De lijst vullen we straks met gegevens uit de database. De knop wordt actief zodra het ophalen van de lijst klaar is.

Een beetje CSS volstaat voor dit voorbeeld:

```css title="src/style.css"
body {
    font-family: sans-serif;
    line-height: 1.5;
    max-width: 40rem;
    margin: 2rem auto;
    padding: 0 1rem;
}

input, button {
    font: inherit;
    padding: 0.4rem;
}

button {
    cursor: pointer;
}
```

## Stap 3: Gegevens ophalen en versturen

Plaats de volgende code in `src/main.ts`:

```typescript title="src/main.ts"
import "./style.css";

interface Planet {
    id: number;
    name: string;
}

const apiUrl: string = "http://localhost:3000/planets";
const list = document.querySelector<HTMLUListElement>("#planet-list");
const form = document.querySelector<HTMLFormElement>("#planet-form");
const nameInput = document.querySelector<HTMLInputElement>("#name");
const addButton = document.querySelector<HTMLButtonElement>("#add-button");
const message = document.querySelector<HTMLParagraphElement>("#message");

if (!list || !form || !nameInput || !addButton || !message) {
    throw new Error("De nodige HTML-elementen ontbreken.");
}

const showPlanet = (planet: Planet): void => {
    const item: HTMLLIElement = document.createElement("li");
    item.textContent = planet.name;
    list.appendChild(item);
};

const loadPlanets = async (): Promise<void> => {
    try {
        const response: Response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("De planeten konden niet worden opgehaald.");
        }
        const planets: Planet[] = await response.json();
        list.replaceChildren();
        for (const planet of planets) {
            showPlanet(planet);
        }
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "De lijst kon niet worden geladen. Controleer of de API draait.";
    } finally {
        addButton.disabled = false;
    }
};

form.addEventListener("submit", async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();

    const name: string = nameInput.value.trim();
    if (name.length === 0) {
        message.textContent = "Vul een naam in.";
        return;
    }

    addButton.disabled = true;
    message.textContent = "";

    try {
        const response: Response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
        if (!response.ok) {
            throw new Error("De planeet kon niet worden toegevoegd.");
        }

        const planet: Planet = await response.json();
        showPlanet(planet);
        form.reset();
        message.textContent = "Planeet toegevoegd.";
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "Toevoegen is mislukt. Probeer het opnieuw.";
    } finally {
        addButton.disabled = false;
    }
});

loadPlanets();
```

### De lijst tonen

Bij het laden van de pagina voert `loadPlanets()` een GET-request uit naar onze API. We wachten met `await` op het antwoord en lezen de JSON als een array van planeten. `showPlanet()` maakt voor elke planeet een `li` aan en voegt die toe aan de lijst.

Met `textContent` tonen we de naam als tekst. Eventuele HTML-tekens in een naam worden daardoor niet als HTML uitgevoerd.

### Het formulier versturen

We zetten een eventlistener op het submit-event van het formulier. De callback is `async`, zodat we `await` kunnen gebruiken bij `fetch()`.

Met `event.preventDefault()` houden we het standaardgedrag van het formulier tegen. De pagina wordt daardoor niet opnieuw geladen. We lezen de naam uit het getypeerde inputelement, maken er JSON van en sturen die naar `POST /planets`.

De API voegt de planeet toe aan MySQL en geeft het aangemaakte object terug, inclusief het id. We tonen dat object meteen in de lijst, maken het formulier leeg en tonen een bericht. Tijdens het versturen is de knop uitgeschakeld, zodat je niet per ongeluk meerdere keren na elkaar dezelfde request verstuurt.

`response.ok` controleert of de HTTP-status geslaagd is. `fetch()` gooit namelijk niet vanzelf een fout bij bijvoorbeeld status `400` of `500`. De interface `Planet` beschrijft de JSON die onze eigen API teruggeeft; ze voert zelf geen controle van de ontvangen data uit.

## Stap 4: Beide applicaties uitvoeren

Start de Express-server vanuit je backendmap:

```bash
npx tsc
node dist/index.js
```

Start Vite in een tweede terminal vanuit `planeten-client`:

```bash
npm run dev -- --port 5173 --strictPort
```

Open `http://localhost:5173`. Gebruik dit adres ook als `origin` in de CORS-configuratie.

1. Je ziet de planeten uit de database in de lijst.
2. Vul bijvoorbeeld `Mars` in en klik op **Toevoegen**.
3. De nieuwe planeet verschijnt onderaan de lijst.
4. Herlaad de pagina. De planeet blijft zichtbaar, want de GET-request haalt ze opnieuw op uit MySQL.

De volledige weg is nu: **formulier → fetch → Express-router → databasefunctie → MySQL**. Het antwoord gaat via de API terug naar de browser, waar we de lijst aanvullen.
