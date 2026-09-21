import express, { type Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);

interface Platforms {
    windows: boolean;
    mac: boolean;
    linux: boolean
}

interface SteamGame {
    releaseYear: number;
    minimumAge: number;
    name: string;
    description: string;
    image: string;
    developer: string;
    platforms: Platforms
}

let games: SteamGame[] = [];

app.use("/", (req, res) => {
    res.render("games", {
        games: games
    });
});

app.listen(app.get("port"), async() => {
    let response = await fetch("https://raw.githubusercontent.com/similonap/json/master/steam.json")
    games = await response.json();
    console.log("Server started on http://localhost:" + app.get('port'));
});