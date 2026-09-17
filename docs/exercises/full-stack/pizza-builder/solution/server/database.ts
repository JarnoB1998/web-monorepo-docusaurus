import mysql, {
    Connection,
    ConnectionOptions,
    RowDataPacket,
    FieldPacket,
    ResultSetHeader
} from "mysql2/promise";
import dotenv from "dotenv";
import { Ingredient, Pizza, PizzaRecord, PizzaIngredient } from "./types";
import initialIngredients from "./ingredients.json";

dotenv.config();
const access: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? "3306"),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "pizza_builder"
};
let databaseConnection: Connection;

export async function getIngredients(): Promise<Ingredient[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id, name, type FROM ingredients ORDER BY id"
    );
    return rows as Ingredient[];
}
export async function getPizzas(): Promise<Pizza[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id, name FROM pizzas ORDER BY id"
    );
    const records: PizzaRecord[] = rows as PizzaRecord[];
    const pizzas: Pizza[] = [];
    for (const record of records) {
        const pizza: Pizza | undefined = await getPizzaById(record.id);
        if (pizza) pizzas.push(pizza);
    }
    return pizzas;
}
export async function getPizzaById(id: number): Promise<Pizza | undefined> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id, name FROM pizzas WHERE id = ?",
        [id]
    );
    const pizza: PizzaRecord | undefined = rows[0] as PizzaRecord | undefined;
    if (!pizza) return undefined;
    const [links]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT pizza_id, ingredient_id FROM pizza_ingredients WHERE pizza_id = ?",
        [id]
    );
    const ingredients: Ingredient[] = await getIngredients();
    const selectedIds: number[] = (links as PizzaIngredient[]).map(
        (link: PizzaIngredient): number => link.ingredient_id
    );
    return {
        id: pizza.id,
        name: pizza.name,
        ingredients: ingredients.filter((ingredient: Ingredient): boolean =>
            selectedIds.includes(ingredient.id)
        )
    };
}
export async function createPizza(
    name: string,
    ingredientIds: number[]
): Promise<Pizza | undefined> {
    const [result]: [ResultSetHeader, FieldPacket[]] = await databaseConnection.execute(
        "INSERT INTO pizzas (name) VALUES (?)",
        [name]
    );
    for (const id of ingredientIds) {
        await databaseConnection.execute(
            "INSERT INTO pizza_ingredients (pizza_id, ingredient_id) VALUES (?, ?)",
            [result.insertId, id]
        );
    }
    return await getPizzaById(result.insertId);
}
export async function deletePizza(id: number): Promise<void> {
    await databaseConnection.execute("DELETE FROM pizza_ingredients WHERE pizza_id = ?", [id]);
    await databaseConnection.execute("DELETE FROM pizzas WHERE id = ?", [id]);
}

async function seedDatabase(): Promise<void> {
    await databaseConnection.execute(
        `CREATE TABLE IF NOT EXISTS ingredients (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, type ENUM('sauce', 'cheese', 'topping') NOT NULL)`
    );
    await databaseConnection.execute(
        `CREATE TABLE IF NOT EXISTS pizzas (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL)`
    );
    await databaseConnection.execute(
        `CREATE TABLE IF NOT EXISTS pizza_ingredients (pizza_id INT, ingredient_id INT, PRIMARY KEY (pizza_id, ingredient_id), FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE CASCADE, FOREIGN KEY (ingredient_id) REFERENCES ingredients(id))`
    );
    const ingredients: Ingredient[] = await getIngredients();
    if (ingredients.length === 0) {
        for (const ingredient of initialIngredients) {
            await databaseConnection.execute(
                "INSERT INTO ingredients (id, name, type) VALUES (?, ?, ?)",
                [ingredient.id, ingredient.name, ingredient.type]
            );
        }
        await createPizza("Hawaï", [1, 4, 12, 8]);
        await createPizza("Veggie Deluxe", [1, 4, 9, 10, 11]);
        await createPizza("Meat Lover", [2, 5, 17, 8, 14]);
    }
}

async function exit(): Promise<void> {
    try {
        await databaseConnection.end();
        console.log("Disconnected from database");
    } catch (error: unknown) {
        console.error(error);
        process.exit(1);
    }
    process.exit(0);
}

export async function connect(): Promise<void> {
    try {
        databaseConnection = await mysql.createConnection(access);
        await seedDatabase();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error: unknown) {
        await databaseConnection?.end();
        throw error;
    }
}
