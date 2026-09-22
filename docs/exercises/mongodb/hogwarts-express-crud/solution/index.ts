import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { connect, createSpell, deleteSpellById, getSpellById,getSpells, updateSpellById } from "./database";
import type { Spell, SpellField } from "./types";
import type { SortDirection } from "mongodb";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

const FIELDS : SpellField[] = [
    {name: "id", readonly: true, type:"number"}, 
    {name: "name", type: "text"}, 
    {name: "type", type: "spelltype"}, 
    {name: "mana", type: "number"}, 
    {name: "description", type: "text"}
];

const SPELL_TYPES : string[] = ["Charm","Curse","Jinx","Hex","Transfiguration","Healing","Conjuration"];

app.use((req, res, next) => {
    res.locals.FIELDS = FIELDS;
    res.locals.SPELL_TYPES = SPELL_TYPES;
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

app.get("/spells/create", async (req, res) => {
    res.render("createSpell");
});

app.post("/spells/create", async (req,res) => {

    const spell : Spell = {
        ...req.body,
        mana: parseInt(req.body.mana)
    }

    await createSpell(spell);

    res.redirect("/");
})

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

app.get("/spells/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);

    const spell: Spell | null = await getSpellById(id);

    if (spell === null) {
        return res.status(404).send("Spell not found");
    }

    res.render("updateSpell", {
        spell: spell
    });
});

app.post("/spells/:id/update", async (req, res) => {
    const id : number = parseInt(req.params.id);

    const spell : Spell = {
        ...req.body,
        id: id,
        mana: parseInt(req.body.mana)
    }
    
    await updateSpellById(id, spell);
    

    res.redirect("/");
});

app.post("/spells/:id/delete", async (req,res) => {
    const id = parseInt(req.params.id);

    await deleteSpellById(id);

    res.redirect("/");
});



app.listen(app.get("port"), async() => {
    await connect();
    console.log("Server started on http://localhost:" + app.get("port"));
});