import express from 'express';

// --------------
// express server
// --------------
// create express app
const app = express();
app.set("port", process.env.PORT || 8888);
app.set("view engine", "ejs");
app.set("views", import.meta.dirname + "/views");

// init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(import.meta.dirname + '/public'));

const cats = [
    "/cats/cat1.jpeg",
    "/cats/cat2.jpeg",
    "/cats/cat3.jpeg",
    "/cats/cat4.jpeg",
    "/cats/cat5.jpeg",
    "/cats/cat6.jpeg",
    "/cats/cat7.jpeg",
    "/cats/cat8.jpeg",
    "/cats/cat9.jpeg",
    "/cats/cat10.jpeg",
    "/cats/cat11.jpeg",
];

app.get("/cats/images", (req, res) => {
    res.render("index", {
        cats
    });
});

app.use((req, res) => res.type("text/html").status(404).send("404 - Not Found"));

// listen to port
app.listen(app.get("port"), () => console.log(`App running on port ${app.get("port")}.`));