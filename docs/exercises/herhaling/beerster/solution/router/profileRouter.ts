import express from "express";
import { getCheckinsByFullName } from "../database";
import type { Checkin } from "../types";

export default function profileRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        let checkins: Checkin[] = [];
        if (res.locals.user) {
            checkins = await getCheckinsByFullName(res.locals.user.fullname);
        }
        res.render("profile", {
            checkins: checkins
        });
    });

    return router;
}