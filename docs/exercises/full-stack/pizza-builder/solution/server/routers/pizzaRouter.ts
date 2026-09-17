import { Router } from "express";
import { Ingredient, Pizza } from "../types";
import { getIngredients, getPizzas, getPizzaById, createPizza, deletePizza } from "../database";

export function pizzaRouter(): Router {
    const router: Router = Router();
    router.get("/ingredients", async (req, res): Promise<void> => {
        res.json(await getIngredients());
    });
    router.get("/pizzas", async (req, res): Promise<void> => {
        res.json(await getPizzas());
    });
    router.post("/pizzas", async (req, res): Promise<void> => {
        const name: unknown = req.body?.name;
        const requested: unknown = req.body?.ingredientIds;
        if (
            typeof name !== "string" ||
            name.trim().length === 0 ||
            name.length > 100 ||
            !Array.isArray(requested)
        ) {
            res.status(400).json({ error: "Geef een naam en ingredientIds." });
            return;
        }
        const ingredients: Ingredient[] = await getIngredients();
        const ingredientIds: number[] = [];
        for (const value of requested) {
            if (
                typeof value !== "number" ||
                !Number.isInteger(value) ||
                ingredientIds.includes(value) ||
                !ingredients.find((ingredient: Ingredient): boolean => ingredient.id === value)
            ) {
                res.status(400).json({ error: "Geef bestaande ingrediënten zonder dubbels." });
                return;
            }
            ingredientIds.push(value);
        }
        const sauces: Ingredient[] = ingredients.filter(
            (ingredient: Ingredient): boolean =>
                ingredient.type === "sauce" && ingredientIds.includes(ingredient.id)
        );
        if (sauces.length !== 1) {
            res.status(400).json({ error: "Kies precies één saus." });
            return;
        }
        const pizza: Pizza | undefined = await createPizza(name.trim(), ingredientIds);
        res.status(201).json(pizza);
    });
    router.delete("/pizzas", async (req, res): Promise<void> => {
        const id: unknown = req.body?.id;
        if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Ongeldig pizza-id." });
            return;
        }
        if (!(await getPizzaById(id))) {
            res.status(404).json({ error: "Pizza niet gevonden." });
            return;
        }
        await deletePizza(id);
        res.status(204).send();
    });
    return router;
}
