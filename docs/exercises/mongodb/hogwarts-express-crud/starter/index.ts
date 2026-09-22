import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { connect, getSpellById,getSpells } from "./database";
import type { Spell } from "./types";
import type { SortDirection } from "mongodb";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

const FIELDS: string[] = ["id", "name", "type", "mana", "description"];

app.use((req, res, next) => {
    res.locals.FIELDS = FIELDS;
    next();
});

app.get("/", async(req, res) => {
    const q: string = typeof req.query.q === "string" ? req.query.q : "";

    const sortField: string = typeof req.query.sortField === "string" ? req.query.sortField : "id";
    const sortDirection : SortDirection = req.query.sortDirection === "desc" ? -1 : 1;

    const spells : Spell[] = await getSpells(q, sortField, sortDirection);

    res.render("index", {
        spells: spells,
        q: q,
        sortDirection: sortDirection,
        sortField: sortField
    });
});

app.get("/spells/:id", async(req, res) => {
    const id = parseInt(req.params.id);

    const spell: Spell | null =  await getSpellById(id);

    if (spell === null) {
        return res.status(404).send("Spell not found");
    }

    res.render("detail", {
        spell: spell
    });
});


app.listen(app.get("port"), async() => {
    await connect();
    console.log("Server started on http://localhost:" + app.get("port"));
});