import { Router } from "express";
import { Reis } from "../models/Reis.ts";
import { getReizen, getReisById, createReis, addKost } from "../reizen.ts";

export function reizenRouter(): Router {
    const router: Router = Router();

    router.get("/reizen", async (req, res): Promise<void> => {
        const reizen: Reis[] = getReizen();
        res.json(reizen);
    });

    router.post("/reis", async (req, res): Promise<void> => {
        const bestemming: unknown = req.body?.bestemming;
        const jaar: unknown = req.body?.jaar;
        if (
            typeof bestemming !== "string" ||
            bestemming.trim().length === 0 ||
            bestemming.length > 100 ||
            typeof jaar !== "number" ||
            !Number.isInteger(jaar) ||
            jaar < 1 ||
            jaar > 9999
        ) {
            res.status(400).json({ error: "Geef een bestemming en een geldig jaar." });
            return;
        }
        const reis: Reis | undefined = createReis(bestemming.trim(), jaar);
        if (!reis) {
            res.status(500).json({ error: "Reis kon niet worden aangemaakt." });
            return;
        }
        res.status(201).json(reis);
    });

    router.get("/reis/:reisid", async (req, res): Promise<void> => {
        const id: number = Number(req.params.reisid);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Ongeldig reisid." });
            return;
        }
        const reis: Reis | undefined = getReisById(id);
        if (reis) res.json(reis);
        else res.status(404).json({ error: "Reis niet gevonden." });
    });

    router.post("/reis/:reisid/kost", async (req, res): Promise<void> => {
        const id: number = Number(req.params.reisid);
        const uitgave: unknown = req.body?.uitgave;
        const prijs: unknown = req.body?.prijs;
        if (
            !Number.isInteger(id) ||
            id <= 0 ||
            typeof uitgave !== "string" ||
            uitgave.trim().length === 0 ||
            uitgave.length > 100 ||
            typeof prijs !== "number" ||
            !Number.isFinite(prijs) ||
            prijs < 0
        ) {
            res.status(400).json({
                error: "Geef een geldig reisid, een uitgave en een prijs vanaf nul."
            });
            return;
        }
        const reis: Reis | undefined = addKost(id, uitgave.trim(), prijs);
        if (reis) res.status(201).json(reis);
        else res.status(404).json({ error: "Reis niet gevonden." });
    });

    router.get("/reis/:reisid/kosten", async (req, res): Promise<void> => {
        const id: number = Number(req.params.reisid);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Ongeldig reisid." });
            return;
        }
        const reis: Reis | undefined = getReisById(id);
        if (reis) res.json(reis.totaal());
        else res.status(404).json({ error: "Reis niet gevonden." });
    });
    return router;
}
