import express, { type Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);

app.use("/", (req, res) => {
    let language : string = typeof req.query.language === "string" ? req.query.language : "en";
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

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});