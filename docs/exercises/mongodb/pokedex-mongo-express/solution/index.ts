import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { connect, createPlayer, getPlayer, getPlayers, getPokemon, getPokemonById, savePlayer } from "./database";
import type { Player, Pokemon } from "./types";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.get("/", async(req, res) => {
    let players : Player[] = await getPlayers();
    res.render("index", {
        players: players
    });
});

app.post("/createPlayer", async (req, res) => {
    let player : Player = {
        name: req.body.name,
        pokemon: []
    }
    await createPlayer(player);
    res.redirect("/");
});

app.get("/player/:id", async(req, res) => {
    let player : Player | undefined = await getPlayer(req.params.id);
    res.render("player" , {
        player: player
    });
});

app.get("/player/:id/pokemon", async(req, res) => {
    let filter = typeof req.query.filter == "string" ? req.query.filter : "";
    let player : Player | undefined = getPlayer(req.params.id);
    let allPokemon : Pokemon[] = await getPokemon();
    if (!player) return res.status(404).send("Player not found");
    if (filter) {
        allPokemon = allPokemon.filter(pokemon => pokemon.types.indexOf(filter) !== -1);
    }

    let heights : number[] = player.pokemon.map(p => p.height) || [];
    let largest : number | undefined = heights.length > 0 ? heights.reduce((prev, curr) => curr > prev ? curr: prev) : undefined;
    let smallest : number | undefined = heights.length > 0 ? heights.reduce((prev, curr) => curr < prev ? curr : prev) : undefined;
    
    let usedTypes = player.pokemon.reduce((prev: string[], curr: Pokemon) => {
        for (let type of curr.types) {
            if (!prev.includes(type)) {
                prev.push(type);
            }
        }
        return prev;
    }
    , []);

    allPokemon = allPokemon.filter(pokemon => player?.pokemon.find(p => p.id === pokemon.id) === undefined);

    res.render("pokemon", {
        allPokemon: allPokemon,
        player: player,
        largest: largest,
        smallest: smallest,
        usedTypes: usedTypes
    });
});

app.post("/player/:id/save", async(req, res) => {
    await savePlayer(req.params.id);
    res.redirect("/player/" + req.params.id);
});

app.post("/player/:id/pokemon/add/:pokeId", async(req, res) => {
    let player : Player | undefined = getPlayer(req.params.id);
    let pokemon : Pokemon | null = await getPokemonById(parseInt(req.params.pokeId));
    if (!pokemon) return res.status(404).send("Pokemon not found");
    if (!player) return res.status(404).send("Player not found");

    pokemon.currentHP = Math.floor(Math.random() * pokemon.maxHP);

    player.pokemon.push(pokemon);

    res.redirect("/player/" + req.params.id + "/pokemon");
});

app.post("/player/:id/pokemon/delete/:pokeId", async (req, res) => {
    let player : Player | undefined = getPlayer(req.params.id);
    let pokemon : Pokemon | null = await getPokemonById(parseInt(req.params.pokeId));
    if (!pokemon) return res.status(404).send("Pokemon not found");
    if (!player) return res.status(404).send("Player not found");

    player.pokemon = player.pokemon.filter((poke) => poke.id !== pokemon.id);

    res.redirect("/player/" + req.params.id + "/pokemon");
});

app.listen(app.get("port"), async() => {
    await connect();
    console.log("Server started on http://localhost:" + app.get('port'));
});