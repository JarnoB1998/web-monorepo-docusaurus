import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));
app.set("views", path.join(import.meta.dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

app.get("/", (req, res) => {
    res.render("index", {
        message: ""
    });
});

function getAge(birthdate: Date, today: Date) {
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

app.post("/", (req, res) => {
    const birthdate : Date = new Date(req.body.birthdate);
    const today: Date = new Date(req.body.today);

    const yearsOld : number = getAge(birthdate, today);

    // DD-MM-YYYY
    let parsedToday : string = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
    res.render("index", {
        message: `You were ${yearsOld} years old on ${parsedToday}`
    })
});

export default app;