import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);


app.get("/", async(req, res) => {
    res.render("index");
});

app.post("/createPlayer", async (req, res) => {
    res.redirect("/");
});

app.get("/player/:id", async(req, res) => {
    res.render("player");
});

app.get("/player/:id/pokemon", async(req, res) => {
    res.render("pokemon");
});

app.post("/player/:id/save", async(req, res) => {
    res.redirect("/player/" + req.params.id);
});

app.post("/player/:id/pokemon/add/:pokeId", async(req, res) => {
    res.redirect("/player/" + req.params.id + "/pokemon");
});

app.post("/player/:id/pokemon/delete/:pokeId", async (req, res) => {
    res.redirect("/player/" + req.params.id + "/pokemon");

});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});