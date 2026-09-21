import express, { type Express} from "express";
import { type Person, type Pokemon } from "./types.ts";

const app = express();

const thisisme : Person = {
    name: "Andie Similon",
    age: 39,
    profilePic: "https://raw.githubusercontent.com/similonap/images/main/thisisme.png"
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

app.set("port", 3000);

app.get("/", (req, res) => {
    const html = `
        <html>
            <head><title>Welcome to the main page</title></head>
            <body>
                <h1>Welcome to the main page</h1><p>This is the main page. Bask in the glory of the main page!</p>
            </body>
        </html>
    `;
    res.type("text/html");
    res.send(html);
});

app.get("/whoami", (req, res) => {
    const html = `
    <html>
        <head><title>Who am I?</title></head>
        <body>
            <p>My name is ${thisisme.name} and I am ${thisisme.age} years old.</p>
            <img src="${thisisme.profilePic}" style="height: 250px"/>
        </body>
    </html>
    `;
    res.type("text/html");
    res.send(html);
});

app.get("/whoamijson", (req, res) => {
    res.type("application/json");
    res.json(thisisme);
});

app.get("/pikachujson", async(req, res) => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const pikachu : Pokemon = await response.json();

    res.json({
        id: pikachu.id,
        name: pikachu.name,
        weight: pikachu.weight,
        frontImage: pikachu.sprites.front_default,
        backImage: pikachu.sprites.back_default
    });
});

app.get("/pikachuhtml", async(req, res) => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const pikachu : Pokemon = await response.json();

    const html = `
    <html>
        <head><title>${pikachu.name}</title></head>
        <body>
            <h1>${pikachu.name}</h1>
            <p>ID: ${pikachu.id}</p>
            <p>Weight: ${pikachu.weight}</p>
            <img src="${pikachu.sprites.front_default}"/>
            <img src="${pikachu.sprites.back_default}"/>
        </body>
    </html>`;

    res.type("text/html");
    res.send(html);
});

app.get("/randomcolor", (req, res) => {
    const color = getRandomColor();
    let html : string = `
    <html>
        <head><title>Random Color</title></head>
        <body style="background-color:${color}; display: flex; justify-content: center; align-items: center; height: 100vh;">
            <h1>${color}</h1>
        </body>
    </html>
    `
    res.type("text/html");
    res.send(html);
});

app.use((req, res) => {
    let html : string =`
    <html>
        <head><title>404 - Not Found</title></head>
        <body>
            <h1>404 - Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
        </body>
    </html>
    `
    res.type("text/html");
    res.status(404);
    res.send(html);
    }
);


app.listen(app.get("port"), () => {
    console.log("Server started listening on port " + app.get("port"));
});