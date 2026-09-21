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
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    let sortedGames = [...games].sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortField === "minimumAge") {
            return sortDirection === "asc" ? a.minimumAge - b.minimumAge : b.minimumAge - a.minimumAge;
        } else if (sortField === "releaseYear") {
            return sortDirection === "asc" ? a.releaseYear - b.releaseYear : b.releaseYear - a.releaseYear;
        } else if (sortField === "developer") {
            return sortDirection === "asc" ? a.developer.localeCompare(b.developer) : b.developer.localeCompare(a.developer);
        } else {
            return 0;
        }
    });

    const sortFields = [
        { value: 'name', text: 'Name', selected: sortField === 'name' ? 'selected' : '' },
        { value: 'minimumAge', text: 'Minimum Age', selected: sortField === 'minimumAge' ? 'selected' : ''},
        { value: 'releaseYear', text: 'Release Year', selected: sortField === 'releaseYear' ? 'selected' : ''},
        { value: 'developer', text: 'Developer', selected: sortField === 'developer' ? 'selected' : ''},
    ];

    const sortDirections = [
        { value: 'asc', text: 'Ascending', selected: sortDirection === 'asc' ? 'selected' : ''},
        { value: 'desc', text: 'Descending', selected: sortDirection === 'desc' ? 'selected' : ''}
    ];
    

    res.render("games", {
        games: sortedGames,
        sortFields: sortFields,
        sortDirections: sortDirections,
        sortField: sortField,
        sortDirection: sortDirection
    });
});

app.listen(app.get("port"), async() => {
    let response = await fetch("https://raw.githubusercontent.com/similonap/json/master/steam.json")
    games = await response.json();
    console.log("Server started on http://localhost:" + app.get('port'));
});