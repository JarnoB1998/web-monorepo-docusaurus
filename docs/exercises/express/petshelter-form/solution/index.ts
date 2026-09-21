import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.set('views', path.join(import.meta.dirname, 'views'));

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", (req, res) => {
    const name: string = req.body.name;
    const animal: string = req.body.animal;

    let random : number = 1 + Math.floor(Math.random() * 5);
    
    res.render("animal", {
        name: name,
        animal: animal,
        image: `/assets/${animal}${random}.png`
    });
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});