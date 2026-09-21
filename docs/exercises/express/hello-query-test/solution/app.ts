import express, { type Express } from "express";
import path from "path";

const app: Express = express();

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
    let language: string = typeof req.query.language === "string" ? req.query.language : "en";
    if (language === "en") {
        res.render("index", { message: "Hello World!" });
    } else if (language === "es") {
        res.render("index", { message: "¡Hola Mundo!" });
    } else if (language === "fr") {
        res.render("index", { message: "Bonjour le monde!" });
    } else {
        res.render("index", { message: "Hello World!" });
    }
});

export default app;
