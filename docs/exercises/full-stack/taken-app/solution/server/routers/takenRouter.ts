import { Router } from "express";
import type { Taak } from "../types";
import { getTaken, getEersteTaak, createTaak, deleteEersteTaak } from "../database";

export function takenRouter(): Router {
    const router: Router = Router();
    router.get("/tasks", async (req, res): Promise<void> => {
        const taken: Taak[] = await getTaken();
        res.json(taken);
    });
    router.get("/task", async (req, res): Promise<void> => {
        const taak: Taak | undefined = await getEersteTaak();
        if (taak) res.json(taak);
        else res.status(404).json({ error: "Er zijn geen taken." });
    });
    router.post("/task", async (req, res): Promise<void> => {
        const omschrijving: unknown = req.body?.omschrijving;
        const naam: unknown = req.body?.naam;
        if (
            typeof omschrijving !== "string" ||
            omschrijving.trim().length === 0 ||
            omschrijving.length > 255 ||
            typeof naam !== "string" ||
            naam.trim().length === 0 ||
            naam.length > 100
        ) {
            res.status(400).json({ error: "Geef een omschrijving en een naam." });
            return;
        }
        const taak: Taak | undefined = await createTaak(omschrijving.trim(), naam.trim());
        res.status(201).json(taak);
    });
    router.post("/task-urgent", async (req, res): Promise<void> => {
        const omschrijving: unknown = req.body?.omschrijving;
        const naam: unknown = req.body?.naam;
        if (
            typeof omschrijving !== "string" ||
            omschrijving.trim().length === 0 ||
            omschrijving.length > 255 ||
            typeof naam !== "string" ||
            naam.trim().length === 0 ||
            naam.length > 100
        ) {
            res.status(400).json({ error: "Geef een omschrijving en een naam." });
            return;
        }
        const taak: Taak | undefined = await createTaak(omschrijving.trim(), naam.trim(), true);
        res.status(201).json(taak);
    });
    router.delete("/task", async (req, res): Promise<void> => {
        const taak: Taak | undefined = await deleteEersteTaak();
        if (taak) res.json(taak);
        else res.status(404).json({ error: "Er zijn geen taken." });
    });
    return router;
}
