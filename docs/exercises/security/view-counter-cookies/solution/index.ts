import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
    let viewed : number = req.cookies.viewed ? parseInt(req.cookies.viewed) : 1;
    res.cookie("viewed", viewed + 1, {
        // maxAge: 86400000
        expires: new Date(Date.now() + 86400000)
    });
    res.render("views", { 
        viewed: viewed
    })
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});