import express from "express";
import type { Beer, Checkin } from "../types";

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
    
    return router;

}