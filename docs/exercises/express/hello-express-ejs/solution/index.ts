import express, { type Express } from "express";
import { type Person, type Pokemon } from "./types.ts";
import { userInfo } from "os";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const thisisme: Person = {
    name: "Andie Similon",
    age: 39,
    profilePic: "/assets/images/thisisme.png"
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
    res.render("main");
});

app.get("/whoami", (req, res) => {
    res.render("whoami", {
        thisisme: thisisme
    })
});

app.get("/whoamijson", (req, res) => {
    res.type("application/json");
    res.json(thisisme);
});

app.get("/pikachujson", async (req, res) => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const pikachu: Pokemon = await response.json();

    res.json({
        id: pikachu.id,
        name: pikachu.name,
        weight: pikachu.weight,
        frontImage: pikachu.sprites.front_default,
        backImage: pikachu.sprites.back_default
    });
});

app.get("/pikachuhtml", async (req, res) => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const pikachu: Pokemon = await response.json();

    res.render("pokemon", {
        pokemon: {
            id: pikachu.id,
            name: pikachu.name,
            weight: pikachu.weight,
            front_default: pikachu.sprites.front_default,
            back_default: pikachu.sprites.back_default
        }
    })
});

app.get("/randomcolor", (req, res) => {
    const color = getRandomColor();

    res.render("randomcolor", {
        color: color
    });
});

app.use((req, res) => {
    let html: string = `
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