import express from "express";
import type { Bar, Beer, Checkin } from "../types";
import app from "../app";
import session from "../session";
import { getCheckins, getBeers, getBars, getTopThreeBars, createCheckin } from "../database";

interface BeerWithCount {
    beer: Beer;
    count: number;
}

export function getTopBeers(checkins: Checkin[], beers: Beer[]): Beer[] {
    const beerCheckinCounts = checkins.reduce((acc: Record<number, number>, checkin: Checkin) => {
        const beerId = checkin.beer.id;
        if (!acc[beerId]) {
            acc[beerId] = 0;
        }
        acc[beerId]++;
        return acc;
    }, {});

    return beers
        .map((beer: Beer) => ({ beer, count: beerCheckinCounts[beer.id] ?? 0 }))
        .sort((a: BeerWithCount, b: BeerWithCount) => b.count - a.count)
        .map((beerWithCount: BeerWithCount) => beerWithCount.beer)
        .slice(0, 3);
}

export default function homeRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        let limit: number = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 5;

        let checkins: Checkin[] = await getCheckins({ date: -1 }, limit);
        let beers: Beer[] = await getBeers();
        let bars: Bar[] = await getBars();
        let topBeers: Beer[] = getTopBeers(checkins, beers);
        let topBars: Bar[] = await getTopThreeBars();
        res.render("index", { checkins, beers, bars, topBeers, topBars });
    });

    router.post("/checkin", async (req, res) => {
        let name: string = res.locals.user?.fullname ?? "Anonymous";
        let barId: number = parseInt(req.body.barId);
        let beerId: number = parseInt(req.body.beerId);
        let comment: string = req.body.comment;
        let date: Date = new Date();

        await createCheckin(barId, beerId, comment, date, name);

        req.session.message = { message: "You have successfully checked in!", type: "success" };
        res.redirect("back");
    });

    return router;

}