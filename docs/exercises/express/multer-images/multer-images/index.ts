import express, { type ErrorRequestHandler, type Express, type NextFunction, type Request, type Response } from "express";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.set("port", process.env.PORT || 3000);

const images : string[] = [];

const upload = multer({
    dest: "public/uploads",
});

app.get("/", (req, res) => {
    res.render("index", {
        images: images
    });
});

app.post("/", upload.single("photo"), (req, res) => {
    let file = req.file as Express.Multer.File;
    if (file) {
        images.push("/uploads/" + file.filename);
        res.render("index", {
            images: images} );
    } else {
        res.send("No file uploaded");
    }
});

app.use((req, res) => {
    res.type("text/html");
    res.status(404);
    res.send("404 - Not Found");
    }
);


app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});