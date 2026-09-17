import { Router } from "express";
import {
    getPokedex,
    getParty,
    catchPokemon,
    releasePokemon,
    addToParty,
    removeFromParty
} from "../database";

export function pokemonRouter(): Router {
    const router: Router = Router();
    router.get("/pokedex", async (req, res): Promise<void> => {
        res.json(await getPokedex());
    });
    router.get("/party", async (req, res): Promise<void> => {
        res.json(await getParty());
    });
    router.post("/pokedex", async (req, res): Promise<void> => {
        const id: unknown = req.body?.id;
        if (typeof id !== "number" || !Number.isInteger(id) || id < 1 || id > 151) {
            res.status(400).json({ error: "Geef een Pokémon-id van 1 tot en met 151." });
            return;
        }
        const caught: number[] = await getPokedex();
        if (caught.includes(id)) {
            res.status(400).json({ error: "Deze Pokémon is al gevangen." });
            return;
        }
        await catchPokemon(id);
        res.status(201).json({ id });
    });
    router.delete("/pokedex", async (req, res): Promise<void> => {
        const id: unknown = req.body?.id;
        if (typeof id !== "number" || !Number.isInteger(id) || id < 1 || id > 151) {
            res.status(400).json({ error: "Ongeldig Pokémon-id." });
            return;
        }
        const caught: number[] = await getPokedex();
        if (!caught.includes(id)) {
            res.status(404).json({ error: "Deze Pokémon is niet gevangen." });
            return;
        }
        await releasePokemon(id);
        res.status(204).send();
    });
    router.post("/party", async (req, res): Promise<void> => {
        const id: unknown = req.body?.id;
        if (typeof id !== "number" || !Number.isInteger(id) || id < 1 || id > 151) {
            res.status(400).json({ error: "Ongeldig Pokémon-id." });
            return;
        }
        const caught: number[] = await getPokedex();
        const party: number[] = await getParty();
        if (!caught.includes(id) || party.includes(id) || party.length >= 6) {
            res.status(400).json({
                error: "Kies een gevangen Pokémon die nog niet in je party zit. Er mogen maximaal zes Pokémon in de party."
            });
            return;
        }
        await addToParty(id);
        res.status(201).json({ id });
    });
    router.delete("/party", async (req, res): Promise<void> => {
        const id: unknown = req.body?.id;
        if (typeof id !== "number" || !Number.isInteger(id) || id < 1 || id > 151) {
            res.status(400).json({ error: "Ongeldig Pokémon-id." });
            return;
        }
        const party: number[] = await getParty();
        if (!party.includes(id)) {
            res.status(404).json({ error: "Deze Pokémon zit niet in je party." });
            return;
        }
        await removeFromParty(id);
        res.status(204).send();
    });
    return router;
}
