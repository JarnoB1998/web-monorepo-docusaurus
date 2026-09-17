export interface Ingredient {
    id: number;
    name: string;
    type: "sauce" | "cheese" | "topping";
}
export interface PizzaRecord {
    id: number;
    name: string;
}
export interface PizzaIngredient {
    pizza_id: number;
    ingredient_id: number;
}
export interface Pizza {
    id: number;
    name: string;
    ingredients: Ingredient[];
}
