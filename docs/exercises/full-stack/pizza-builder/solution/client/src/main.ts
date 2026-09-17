import "./style.css";
import { Ingredient, Pizza } from "./types";
import { getIngredients, getPizzas, createPizza, deletePizza } from "./pizzabuilder";

const form = document.querySelector<HTMLFormElement>("#pizza-form");
const nameInput = document.querySelector<HTMLInputElement>("#name");
const sauceSelect = document.querySelector<HTMLSelectElement>("#sauce");
const cheeseSelect = document.querySelector<HTMLSelectElement>("#cheese");
const toppingsSelect = document.querySelector<HTMLSelectElement>("#toppings");
const pizzasElement = document.querySelector<HTMLDivElement>("#pizzas");
const message = document.querySelector<HTMLParagraphElement>("#message");
if (
    !form ||
    !nameInput ||
    !sauceSelect ||
    !cheeseSelect ||
    !toppingsSelect ||
    !pizzasElement ||
    !message
)
    throw new Error("HTML-element ontbreekt.");

const showIngredients = async (): Promise<void> => {
    const ingredients: Ingredient[] = await getIngredients();
    for (const ingredient of ingredients) {
        const option: HTMLOptionElement = document.createElement("option");
        option.value = String(ingredient.id);
        option.textContent = ingredient.name;
        if (ingredient.type === "sauce") sauceSelect.appendChild(option);
        else if (ingredient.type === "cheese") cheeseSelect.appendChild(option);
        else toppingsSelect.appendChild(option);
    }
};

const showPizzas = async (): Promise<void> => {
    const pizzas: Pizza[] = await getPizzas();
    pizzasElement.replaceChildren();
    for (const pizza of pizzas) {
        const card: HTMLElement = document.createElement("article");
        const title: HTMLHeadingElement = document.createElement("h3");
        title.textContent = pizza.name;
        const ingredients: HTMLParagraphElement = document.createElement("p");
        ingredients.textContent = pizza.ingredients
            .map((ingredient: Ingredient): string => ingredient.name)
            .join(", ");
        const button: HTMLButtonElement = document.createElement("button");
        button.textContent = "Verwijderen";
        button.addEventListener("click", async (): Promise<void> => {
            button.disabled = true;
            try {
                await deletePizza(pizza.id);
                await showPizzas();
                message.textContent = "Pizza verwijderd.";
            } catch (error: unknown) {
                console.error(error);
                message.textContent = "Pizza verwijderen mislukt.";
                button.disabled = false;
            }
        });
        card.append(title, ingredients, button);
        pizzasElement.appendChild(card);
    }
};

form.addEventListener("submit", async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    const ingredientIds: number[] = [Number(sauceSelect.value)];
    for (const option of cheeseSelect.selectedOptions) ingredientIds.push(Number(option.value));
    for (const option of toppingsSelect.selectedOptions) ingredientIds.push(Number(option.value));
    try {
        await createPizza(nameInput.value.trim(), ingredientIds);
        form.reset();
        await showPizzas();
        message.textContent = "Pizza opgeslagen.";
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "Pizza opslaan mislukt. Kies een naam en één saus.";
    }
});

const main = async (): Promise<void> => {
    try {
        await showIngredients();
        await showPizzas();
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "Ophalen mislukt. Controleer de server.";
    }
};
main();
