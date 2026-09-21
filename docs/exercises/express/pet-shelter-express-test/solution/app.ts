import express, { type Express } from "express";
import path from "path";

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));
app.set("views", path.join(import.meta.dirname, "views"));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", (req, res) => {
    const name: string = req.body.name;
    const animal: string = req.body.animal;

    const random: number = 1 + Math.floor(Math.random() * 5);

    res.render("animal", {
        name: name,
        animal: animal,
        image: `/assets/${animal}${random}.png`
    });
});

export default app;
