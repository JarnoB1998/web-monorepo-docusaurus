import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));
app.use(cookieParser());

app.set("port", process.env.PORT || 3000);

const products : string[] = [
    "Twix",
    "Mars",
    "Snickers",
    "Bounty",
    "Milky Way",
    "Kinder Bueno",
];

interface Cart {
    [key: string]: number;
}

app.get("/", (req, res) => {
    const cart: Cart = {};
    res.render("index", { products : products,cart: cart });
});

app.post("/add", (req, res) => {
    res.redirect("/");
});

app.post("/remove", (req, res) => {
    res.redirect("/");
});

app.post("/clear", (req, res) => {
    res.redirect("/");
}); 


app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});