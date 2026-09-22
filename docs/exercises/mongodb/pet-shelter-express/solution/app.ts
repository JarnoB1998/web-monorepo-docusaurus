import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { connect, getPets, getPetsByType, getPetsWithAgeBetween, getSortedPets, searchPets } from "./database";
import type { Pet } from "./types";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.get("/pets", async (req, res) => {
    let pets : Pet[] = await getPets();
    res.render("pets", { pets });
});

app.get("/pets/sort", async (req, res) => {
    try {
        let field : string = typeof req.query.field === "string" ? req.query.field : "name";
        let pets : Pet[] = await getSortedPets(field);
        res.render("pets", { pets });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});


app.get("/pets/ageBetween", async (req, res) => {
    let min : number = typeof req.query.min === "string" ? parseInt(req.query.min) : 0;
    let max : number = typeof req.query.max === "string" ? parseInt(req.query.max) : 100;

    let pets : Pet[] = await getPetsWithAgeBetween(min, max);

    res.render("pets", { pets });
});


app.get("/pets/search", async (req, res) => {
    let q: string = typeof req.query.q === "string" ? req.query.q : "";

    let pets : Pet[] = [];
    if (q !== "") {
        pets = await searchPets(q);
    } else {
        pets = await getPets();
    }

    res.render("search", { pets, q });
});

app.get("/pets/:type", async (req, res) => {
    let type : string = typeof req.params.type === "string" ? req.params.type : "";
    let pets : Pet[] = await getPetsByType(type);
    res.render("pets", { pets });
});

export default app;