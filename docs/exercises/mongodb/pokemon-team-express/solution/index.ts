import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import type { TeamPokemon } from "./types";
import { addToTeam, getTeam } from "./database";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

let pokemon: string[] = [
    "Bulbasaur",
    "Ivysaur",
    "Venusaur",
    "Charmander",
    "Charmeleon",
    "Charizard",
    "Squirtle",
    "Wartortle",
    "Blastoise",
    "Caterpie",
    "Metapod",
    "Butterfree",
    "Weedle",
    "Kakuna",
    "Beedrill",
    "Pidgey",
    "Pidgeotto",
    "Pidgeot",
    "Rattata",
    "Raticate",
    "Spearow",
];

app.get("/", async (req, res) => {
    let team: TeamPokemon[] = await getTeam();
    res.render("index", {
        pokemon: pokemon,
        team: team, 
        error: ""
    });
});

app.post("/", async (req, res) => {
    let index: number = parseInt(req.body.pokemon);
    let error: string = "";
    try {
        await addToTeam(pokemon[index]);
    } catch (e : any) {
        error = e.message;
    }
    let team: TeamPokemon[] = await getTeam();

    res.render("index", {
        pokemon: pokemon,
        team: team,
        error: error
    });
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});