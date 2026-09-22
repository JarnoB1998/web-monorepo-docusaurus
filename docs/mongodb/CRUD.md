# CRUD

Een veel voorkomende vorm van web applicatie is een CRUD applicatie. CRUD staat voor Create, Read, Update en Delete. Dit zijn de vier basis operaties die je kan uitvoeren op een database. Eigenlijk is elke eenvoudige admin dashboard een CRUD applicatie. In dit artikel gaan we een eenvoudige CRUD applicatie maken met MongoDB en Express. De initiele data is afkomstig van `https://jsonplaceholder.typicode.com/users` wat een lijst van gebruikers bevat. We willen dus een applicatie maken waar we gebruikers kunnen toevoegen, verwijderen, updaten en bekijken.

We gaan geen rekening houden met error afhandeling in dit deel van de cursus. We gaan er vanuit dat alles goed gaat. In een productie omgeving is het belangrijk om error afhandeling te voorzien.

## Inladen van de JSON data

We gaan eerst de JSON data vanuit de API inladen in onze MongoDB database. We plaatsen de volgende code in een nieuw bestand `database.ts`.

```typescript
import { type Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import type { User } from "./types";
dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

export const collection : Collection<User> = client.db("exercises").collection<User>("users");

export async function getUsers() {
    return await collection.find({}).toArray();
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function loadUsersFromApi() {
    const users : User[] = await getUsers();
    if (users.length == 0) {
        console.log("Database is empty, loading users from API")
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const users : User[] = await response.json();
        await collection.insertMany(users);
    }
}

export async function connect() {
    try {
        await client.connect();
        await loadUsersFromApi();   
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}
```

:::info
De interfaces voor `User` kun je terugvinden op de volgende [Gist](https://gist.github.com/PhilippeSchraepen/edf615367095b8e35e0708709188fb75)
:::

En we roepen de `connect` functie aan in ons `index.ts` bestand.

```typescript
import { connect } from "./database";

app.listen(3000, async () => {
    await connect();
    console.log("Server is running on port 3000");
});
```

Bij het opstarten van de server gaan we de connectie maken met de database en de data inladen vanuit de API. We gaan de data enkel inladen als de database leeg is. We gaan de data inladen in de `users` collectie van de `exercises` database.

## Lezen van de data (READ)

We gaan nu de data lezen vanuit de database en tonen op de webpagina. We gaan de volgende code toevoegen aan ons `index.ts` bestand. Eerst importeren we de `getUser` functie vanuit de `database.ts` bestand.

```typescript
import { connect, getUsers } from "./database";
```

```typescript
app.get("/users", async(req, res) => {
    let users : User[] = await getUsers();
    res.render("users/index", {
        users: users
    });
});
```

en maken we een `index.ejs` bestand aan in de `views/users` map. We zorgen ook voor een `partials` map in de `views` map en maken een `header.ejs` en `footer.ejs` bestand aan.

```html
<%- include("../partials/header") %>
    <section>
        <header>
            <h1>Manage Users</h1>
        </header>
        <% for (let user of users) { %>
            <article>
                <header>
                    <h2><%= user.name %></h2>
                    <p><strong>Username:</strong> <%= user.username %></p>
                </header>
                <p><strong>Email:</strong> <%= user.email %></p>
                <address>
                    <strong>Address:</strong> <%= user.address.street %>, <%= user.address.suite %>, <%= user.address.city %>, <%= user.address.zipcode %>
                </address>
                <p><strong>Phone:</strong> <%= user.phone %></p>
                <p><strong>Website:</strong> <a href="http://<%= user.website %>"><%= user.website %></a></p>
                <p><strong>Company:</strong> <%= user.company.name %></p>
            </article>
        <% } %>
    </section>
<%- include("../partials/footer") %>
```

We tonen de gebruikers in een lijst op de webpagina. We tonen de naam, gebruikersnaam, email, adres, telefoonnummer, website en bedrijfsnaam van de gebruiker.

## Toevoegen van data (CREATE)

We maken nu een nieuw formulier aan om een gebruiker toe te voegen en plaatsen deze code in een nieuw bestand `views/users/create.ejs`.

```html
<%- include("../partials/header") %>
<section>
    <header>
        <h1>Create User</h1>
    </header>
    <form action="/users/create" method="POST">
        <div>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        <fieldset>
            <legend>Address</legend>
            <div>
                <label for="street">Street:</label>
                <input type="text" id="street" name="address[street]" required>
            </div>
            <div>
                <label for="suite">Suite:</label>
                <input type="text" id="suite" name="address[suite]">
            </div>
            <div>
                <label for="city">City:</label>
                <input type="text" id="city" name="address[city]" required>
            </div>
            <div>
                <label for="zipcode">Zipcode:</label>
                <input type="text" id="zipcode" name="address[zipcode]" required>
            </div>
        </fieldset>
        <div>
            <label for="phone">Phone:</label>
            <input type="text" id="phone" name="phone" required>
        </div>
        <div>
            <label for="website">Website:</label>
            <input type="text" id="website" name="website">
        </div>
        <fieldset>
            <legend>Company</legend>
            <div>
                <label for="companyName">Company Name:</label>
                <input type="text" id="companyName" name="company[name]" required>
            </div>
            <div>
                <label for="catchPhrase">Catch Phrase:</label>
                <input type="text" id="catchPhrase" name="company[catchPhrase]">
            </div>
            <div>
                <label for="bs">BS:</label>
                <input type="text" id="bs" name="company[bs]">
            </div>
        </fieldset>
        <button type="submit">Create User</button>
    </form>
</section>
<%- include("../partials/footer") %>
```

We voorzien hier voor elk veld een input veld. We gebruiken een `fieldset` element om de adres en bedrijfsgegevens te groeperen. Door de naam van de input velden te voorzien van `address[street]` en `company[name]` kunnen we deze gegevens later makkelijk groeperen in een object. Als je dan de body van de request bekijkt in de Express server, dan zie je dat de `address` en `company` gegevens in een object komen te staan. We gaan nu twee routes aanmaken om de data te verwerken: een GET route om het formulier te tonen en een POST route om de data te verwerken.

```typescript
app.get("/users/create", async(req, res) => {
    res.render("users/create");
});

app.post("/users/create", async(req, res) => {
    let user : User = req.body;
    await createUser(user);
    res.redirect("/users");
});
```

We doen op het einde van de POST route een redirect naar de gebruikerslijst. Dit zorgt ervoor dat de gebruiker na het toevoegen van een gebruiker terug naar de gebruikerslijst gaat. We voorzien hier nog geen error afhandeling.

We gaan nu de `createUser` functie toevoegen aan ons `database.ts` bestand.

```typescript
export async function getNextId() {
    let users : User[] = await collection.find({}).sort({id: -1}).limit(1).toArray();
    if (users.length == 0) {
        return 1;
    } else {
        return users[0].id + 1;
    }
}

export async function createUser(user: User) {
    user.id = await getNextId();
    return await collection.insertOne(user);
}
```

We voorzien hier ook een `getNextId` functie die het volgende id ophaalt uit de database. We sorteren de gebruikers op id in aflopende volgorde en nemen de eerste gebruiker. Als er geen gebruikers zijn dan geven we 1 terug. We voegen dan 1 toe aan het id en geven dit terug. We gaan nu de gebruiker toevoegen aan de database. Vergeet de `createUser` functie niet te importeren in het `index.ts` bestand.

```typescript
import { connect, getUsers, createUser } from "./database";
```

## Delete van data (DELETE)

We gaan nu een button toevoegen aan de gebruikerslijst om een gebruiker te verwijderen. We voegen de volgende code toe aan het `index.ejs` bestand.

```html
<% for (let user of users) { %>
...
<form action="/users/<%= user.id %>/delete" method="POST">
    <button type="submit">Delete</button>
</form>
...
<% } %>
```

Er wordt dus voor elke gebruiker in de lijst een formulier aangemaakt met een button om de gebruiker te verwijderen. Dit doen we omdat we geen POST requets kunnen doen vanuit een anchor tag. Merk ook op dat we hier een POST gebruiken en geen DELETE. Dit is omdat we geen DELETE requests kunnen doen vanuit een formulier. We gaan nu de route aanmaken om de gebruiker te verwijderen.

We voorzien een nieuwe route in het `index.ts` bestand.

```typescript
app.post("/users/:id/delete", async(req, res) => {
    let id : number = parseInt(req.params.id);
    await deleteUser(id);
    res.redirect("/users");
});
```

We gaan nu de `deleteUser` functie toevoegen aan ons `database.ts` bestand.

```typescript
export async function deleteUser(id: number) {
    return await collection.deleteOne({id: id});
}
```

We gaan nu de gebruiker verwijderen uit de database. Vergeet de `deleteUser` functie niet te importeren in het `index.ts` bestand.

```typescript
import { connect, getUsers, createUser, deleteUser } from "./database";
```

## Updaten van data (UPDATE)

We kunnen nu de code van het create formulier hergebruiken om een update formulier te maken. We maken een nieuw bestand `views/users/update.ejs` aan.

```html
<%- include("../partials/header") %>
<section>
    <header>
        <h1>Update User</h1>
    </header>
    <form action="/users/<%= user.id %>/update" method="POST">
        <div>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" value="<%= user.name %>" required>
        </div>
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" value="<%= user.username %>" required>
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="<%= user.email %>" required>
        </div>
        <fieldset>
            <legend>Address</legend>
            <div>
                <label for="street">Street:</label>
                <input type="text" id="street" name="address[street]" value="<%= user.address.street %>" required>
            </div>
            <div>
                <label for="suite">Suite:</label>
                <input type="text" id="suite" name="address[suite]" value="<%= user.address.suite %>">
            </div>
            <div>
                <label for="city">City:</label>
                <input type="text" id="city" name="address[city]" value="<%= user.address.city %>" required>
            </div>
            <div>
                <label for="zipcode">Zipcode:</label>
                <input type="text" id="zipcode" name="address[zipcode]" value="<%= user.address.zipcode %>" required>
            </div>
        </fieldset>
        <div>
            <label for="phone">Phone:</label>
            <input type="text" id="phone" name="phone" value="<%= user.phone %>" required>
        </div>
        <div>
            <label for="website">Website:</label>
            <input type="text" id="website" name="website" value="<%= user.website %>">
        </div>
        <fieldset>
            <legend>Company</legend>
            <div>
                <label for="companyName">Company Name:</label>
                <input type="text" id="companyName" name="company[name]" value="<%= user.company.name %>" required>
            </div>
            <div>
                <label for="catchPhrase">Catch Phrase:</label>
                <input type="text" id="catchPhrase" name="company[catchPhrase]" value="<%= user.company.catchPhrase %>">
            </div>
            <div>
                <label for="bs">BS:</label>
                <input type="text" id="bs" name="company[bs]" value="<%= user.company.bs %>">
            </div>
        </fieldset>
        <button type="submit">Update User</button> <!-- Changed the button text to `Update User` -->
    </form>
</section>
<%- include("../partials/footer") %>
```

We zorgen ervoor dat de input velden gevuld zijn met de huidige waarden van de gebruiker en dat we als action de update route gebruiken. We gaan nu de route aanmaken om de gebruiker te updaten.

We voorzien weer twee routes in het `index.ts` bestand. Een GET route om het formulier te tonen en een POST route om de data te verwerken.

```typescript
app.get("/users/:id/update", async(req, res) => {
    let id : number = parseInt(req.params.id);
    let user : User | null = await getUserById(id);
    res.render("users/update", {
        user: user
    });
});

app.post("/users/:id/update", async(req, res) => {
    let id : number = parseInt(req.params.id);
    let user : User = req.body;
    await updateUser(id, user);
    res.redirect("/users");
});
```

We redirecten ook hier op het einde van de POST route naar de gebruikerslijst. We gaan nu de `getUserById` en `updateUser` functies toevoegen aan ons `database.ts` bestand.

```typescript
export async function getUserById(id: number) {
    return await collection.findOne({ id: id });
}

export async function updateUser(id: number, user: User) {
    return await collection.updateOne({ id : id }, { $set:  user });
}
```

Vergeet de `getUserById` en `updateUser` functies niet te importeren in het `index.ts` bestand.

```typescript
import { connect, getUsers, createUser, deleteUser, getUserById, updateUser } from "./database";
```
