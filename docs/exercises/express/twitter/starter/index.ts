import express from "express";
import { createTweet, getProfileByHandle, getTweets, getTweetsByHandle } from "./data.ts";
import {type Profile, type Tweet } from "./types.ts";

const app = express();

app.set("view engine","ejs");

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended:true}));

app.get("", async(req,res) => {
    let tweets = await getTweets();
    return res.render("index");
});

app.get("/TheLichKing", async(req,res) => {
    res.render("profile");
});

app.listen(3000, async() => {
    console.log(`The application is listening on http://localhost:3000`);
})