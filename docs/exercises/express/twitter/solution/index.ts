import express, { type Request, type Response, type Express } from "express";
import { createTweet, getProfileByHandle, getTweets, getTweetsByHandle } from "./data.ts";
import { type Profile, type Tweet } from "./types.ts";

const app : Express = express();

app.set("view engine","ejs");

app.use(express.static("public"));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended:true}));

app.get("", async(req: Request,res: Response) => {
    let tweets : Tweet[] = await getTweets();
    return res.render("index", {
        tweets: tweets
    });
});

app.post("", async(req: Request,res: Response)=> {
    let text : string = req.body.text;
    let handle: string = req.body.handle;
    let profile = await getProfileByHandle(handle);

    if (profile) {
        await createTweet({text: text, handle: handle, createdOn: new Date(), name: profile.name});
        res.redirect("/");
    } else {
        res.status(404).send("No user found by that handle");
    }
});

app.get("/:handle", async(req: Request<{ handle: string }>,res: Response) => {
    let handle : string = req.params.handle;
    let profile : Profile | undefined = await getProfileByHandle(handle);

    if (profile) {
        let tweets : Tweet[] = await getTweetsByHandle(handle);
        res.render("profile", {
            profile: profile,
            tweets: tweets
        });
    } else {
        res.status(404).send("No user found by that handle");
    }
});

app.listen(3000, async() => {
    console.log(`The application is listening on http://localhost:3000`);
})
