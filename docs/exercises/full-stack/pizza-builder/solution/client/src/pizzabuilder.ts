import type { Ingredient, Pizza } from "./types";

const apiUrl: string = "http://localhost:3000";

export async function getIngredients(): Promise<Ingredient[]> {
    const response: Response = await fetch(`${apiUrl}/ingredients`);
    if (!response.ok) throw new Error("Ingrediënten ophalen mislukt.");
    const ingredients: Ingredient[] = await response.json();
    return ingredients;
}

export async function getPizzas(): Promise<Pizza[]> {
    const response: Response = await fetch(`${apiUrl}/pizzas`);
    if (!response.ok) throw new Error("Pizza's ophalen mislukt.");
    const pizzas: Pizza[] = await response.json();
    return pizzas;
}

export async function createPizza(name: string, ingredientIds: number[]): Promise<void> {
    const response: Response = await fetch(`${apiUrl}/pizzas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ingredientIds })
    });
    if (!response.ok) throw new Error("Pizza opslaan mislukt.");
}

export async function deletePizza(id: number): Promise<void> {
    const response: Response = await fetch(`${apiUrl}/pizzas`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error("Pizza verwijderen mislukt.");
}
