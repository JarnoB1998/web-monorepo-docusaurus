import { Router } from "express";
import { Pokemon } from "../types";
import { getPokemon, getPokemonById, catchPokemon, releasePokemon } from "../database";

export function pokemonRouter(): Router {
    const router: Router = Router();
    router.get("/pokemon", async (req, res): Promise<void> => {
        const pokemon: Pokemon[] = await getPokemon();
        res.json(pokemon);
    });
    router.post("/pokemon", async (req, res): Promise<void> => {
        const id: unknown = req.body?.id;
        const name: unknown = req.body?.name;
        if (
            typeof id !== "number" ||
            !Number.isInteger(id) ||
            id <= 0 ||
            typeof name !== "string" ||
            name.trim().length === 0 ||
            name.length > 100
        ) {
            res.status(400).json({ error: "Geef een geldig id en een naam." });
            return;
        }
        if (await getPokemonById(id)) {
            res.status(400).json({ error: "Deze Pokémon is al gevangen." });
            return;
        }
        await catchPokemon(id, name.trim());
        res.status(201).json({ id, name: name.trim() });
    });
    router.delete("/pokemon/:id", async (req, res): Promise<void> => {
        const id: number = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Ongeldig id." });
            return;
        }
        if (!(await getPokemonById(id))) {
            res.status(404).json({ error: "Pokémon niet gevonden." });
            return;
        }
        await releasePokemon(id);
        res.status(204).send();
    });
    return router;
}
