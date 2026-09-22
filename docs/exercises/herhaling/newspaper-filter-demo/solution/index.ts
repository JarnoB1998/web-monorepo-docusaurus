import express, { type Express } from "express";
import { articles, topics } from "./data";

import dotenv from "dotenv";
import path from "path";
import type { NewsArticle } from "./types";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

const SORT_FIELDS: string[] = ["id","title","topic"];
const SORT_DIRECTIONS: string[] = ["asc", "desc"];

app.get("/create", (req, res) => {
    res.render("create", {
        topics: topics,
        error: "",
        title: "",
        topic: "",
        content: ""
    });
});

app.post("/create", (req, res) => {

    const title: string = req.body.title;
    const content: string = req.body.content;
    const topic: string = req.body.topic;

    let error: string = "";

    if (title === "") error = "Please enter title";
    if (content === "") error = "Please enter content";
    if (topic === "") error = "Please enter topic";

    if (error) {
        res.render("create", {
            topics:topics,
            error: error,
            title: title,
            content: content,
            topic: topic
        });
    }

    let maxId: number = articles.reduce((prev, curr) => {
        return Math.max(prev, curr.id);
    }, 0);

    const newArticle: NewsArticle = {
        id: maxId,
        title: title,
        content: content,
        topic: topic
    }

    articles.push(newArticle);

    res.redirect("/");
});

app.get("/article/:id", (req, res) => {
    const id: number = Number(req.params.id);

    const article: NewsArticle | undefined = articles.find(article => article.id === id);
    if (article === undefined) {
        res.status(404);
        res.send("Article not found");
    }

    res.render("article", {
        article: article
    });
});


app.get("/", (req, res) => {
    const q : string = typeof req.query.q === "string" ? req.query.q : "";
    const sortField: string = typeof req.query.sortField === "string" ? req.query.sortField : "id";
    const sortDirection: string = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";

    const filteredArticles: NewsArticle[] = articles.filter(article => {
        return article.title.toUpperCase().includes(q.toUpperCase());
    }).sort((a,b) => {
        if (sortField === "id") {
            return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
        } else if (sortField === "title") {
            return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sortField === "topic") {
            return sortDirection === "asc" ? a.topic.localeCompare(b.topic) : b.topic.localeCompare(a.topic);
        } else {
            return 0;
        }
    });
    

    res.render("index", {
        articles: filteredArticles,
        topics: topics,
        q: q,
        activeSortField: sortField,
        activeSortDirection: sortDirection,
        SORT_FIELDS: SORT_FIELDS,
        SORT_DIRECTIONS: SORT_DIRECTIONS
    });
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get("port"));
});