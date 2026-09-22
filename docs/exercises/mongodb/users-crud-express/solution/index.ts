import express, { type Express,type Request, type Response,type NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import type { User } from "./types";
import { connect, getUsers,createUser,deleteUser, getUserById, updateUser } from "./database";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.get("/users", async(req, res) => {
    let users : User[] = await getUsers();
    res.render("users/index", {
        users: users
    });
});

app.get("/users/create", async(req, res) => {
    res.render("users/create");
});

app.post("/users/create", async(req, res) => {
    let user : User = req.body;
    await createUser(user);
    res.redirect("/users");
});

app.get("/users/:id/update", async(req, res) => {
    let id : number = parseInt(req.params.id);
    let user : User | null = await getUserById(id);
    res.render("users/update", {
        user: user
    });
});

app.post("/users/:id/update", async(req, res) => {
    let id : number = parseInt(req.params.id);
    let user : User = req.body;
    await updateUser(id, user);
    res.redirect("/users");
});


app.post("/users/:id/delete", async(req, res) => {
    let id : number = parseInt(req.params.id);
    await deleteUser(id);
    res.redirect("/users");
});


app.listen(app.get("port"), async() => {
    await connect();
    console.log("Server started on http://localhost:" + app.get('port'));
});