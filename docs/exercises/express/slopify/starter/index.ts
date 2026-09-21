import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { addCredits, buySong, getCurrentUser, getSongById, getSongs } from "./data.ts";
import { type Song, type User } from "./types.ts";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(import.meta.dirname, "views"));
app.use(express.static(path.join(import.meta.dirname, "public")));

app.set("port", process.env.PORT || /* istanbul ignore next */ 3000);

app.post("/buy", async(req,res) => {
    res.render("billing");
})

app.get("/billing", async(req,res) => {
    res.render("billing");
})

app.post("/billing", async(req,res) => {
    res.render("billing");
});

app.get("/", (req,res) => {
    res.redirect("/songs");
})

app.get("/songs", async(req, res) => {
    res.render("songs")
});

app.get("/songs/:id", async(req, res) => {
    res.render("song")
})

if (import.meta.main) {
    app.listen(app.get("port"), () => {
        console.log("Server started on http://localhost:" + app.get('port'));
    });
}


export { app };