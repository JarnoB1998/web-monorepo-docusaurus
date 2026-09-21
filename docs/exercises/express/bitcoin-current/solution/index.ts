import express from "express";
import type { Express, Request, Response } from "express";
import { type RootObject } from "./types.ts";

const app : Express = express();

app.set("port", 3000);

app.get("/", (req: Request, res: Response) => {
    res.send(`
        <html>
            <head>
            </head>
            <body>
                <h1>Bitcoin Current Price</h1>
                <a href="/bitcoin">Check current price</a>
            </body>
        </html>       
    `);
});

app.get("/bitcoin", async(req: Request, res: Response) => {
    const response = await fetch("https://sampleapis.assimilate.be/bitcoin/current");

    const priceObject : RootObject = await response.json();

    res.type("html")
    res.send(`
        <html>
            <head>
            </head>
            <body>
                <h1>Bitcoin Current Price</h1>
                <h2>Updated at: ${priceObject.time.updated}</h2>
                <table>
                    <tr>
                        <th>USD</th>
                        <td>${priceObject.bpi.USD.rate}</td>
                    </tr>
                    <tr>
                        <th>GBP</th>
                        <td>${priceObject.bpi.GBP.rate}</td>
                    </tr>
                    <tr>
                        <th>EUR</th>
                        <td>${priceObject.bpi.EUR.rate}</td>
                    </tr>
                </table>
            </body>
        </html>
    `)
});


app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`);
});