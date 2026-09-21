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
app.use(express.static(path.join(import.meta.dirname, "public")));
app.set('views', path.join(import.meta.dirname, "views"));

app.set("port", process.env.PORT || /* istanbul ignore next */ 3000);

app.post("/buy", async(req,res) => {
    try {
        let id : number = parseInt(req.body.id);
        if (isNaN(id)) {
            throw new Error("Id must be a number");
        }
        await buySong(id);
        
        res.redirect("/songs")
    } catch (e: any) {
        res.render("billing", {
            error: e.message,
        })
    }
})

app.get("/billing", async(req,res) => {
    res.render("billing", {
        error: ""
    })
})

app.post("/billing", async(req,res) => {
    try {
        let amount: number = parseInt(req.body.amount);

        if (!isNaN(amount) && amount > 0) {
            await addCredits(amount);
        } else {
            throw new Error("Amount should be a positive number")
        }

        res.redirect("/songs");
    } catch (e: any) {
        res.render("billing", {
            error: e.message
        });
    } 
});

app.get("/", (req,res) => {
    res.redirect("/songs");
})

app.get("/songs", async(req, res) => {

    const q : string = typeof req.query.q === "string" ? req.query.q : "";
    const sortField: string = typeof req.query.sortField === "string" ? req.query.sortField : "title";
    const sortDirection: string = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";

    if (sortField !== "owned" && sortField !== "title" && sortField !== "publish_date") {
        return res.status(400).send("Invalid sort field");
    }
    if (sortDirection !== "asc" && sortDirection !== "desc") {
        return res.status(400).send("Invalid sort direction")
    }
    
    let songs: Song[] = await getSongs(q,sortField, sortDirection);

    let currentUser: User = await getCurrentUser();
    
    res.render("songs", {
        error: "",
        songs: songs,
        q: q,
        sortField: sortField,
        sortDirection: sortDirection,
        currentUser: currentUser
    });
});

app.get("/songs/:id", async(req, res) => {
    let id : number = parseInt(req.params.id);
    let song : Song | undefined = await getSongById(id);

    let currentUser: User = await getCurrentUser();


    if (!song) {
        res.status(404);
        return res.render("404");
    }

    res.render("song", { song, currentUser })
})

if (import.meta.main) {
    app.listen(app.get("port"), () => {
        console.log("Server started on http://localhost:" + app.get('port'));
    });
}


export { app };
