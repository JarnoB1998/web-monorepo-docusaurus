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
    let url : string = req.body.url;
    res.redirect(url);
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});