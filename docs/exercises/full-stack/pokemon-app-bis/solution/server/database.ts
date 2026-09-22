import mysql, {
    type Connection,
    type ConnectionOptions,
    type RowDataPacket,
    type FieldPacket,
    type ResultSetHeader
} from "mysql2/promise";
import dotenv from "dotenv";
import type { PokemonId } from "./types";

dotenv.config();
const access: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? "3306"),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "pokemon_party"
};
let databaseConnection: Connection;

export async function getPokedex(): Promise<number[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id FROM caught_pokemon ORDER BY id"
    );
    const pokemon: PokemonId[] = rows as PokemonId[];
    return pokemon.map((item: PokemonId): number => item.id);
}
export async function getParty(): Promise<number[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id FROM party ORDER BY id"
    );
    const pokemon: PokemonId[] = rows as PokemonId[];
    return pokemon.map((item: PokemonId): number => item.id);
}
export async function catchPokemon(id: number): Promise<void> {
    await databaseConnection.execute("INSERT INTO caught_pokemon (id) VALUES (?)", [id]);
}
export async function releasePokemon(id: number): Promise<void> {
    await databaseConnection.execute("DELETE FROM party WHERE id = ?", [id]);
    await databaseConnection.execute("DELETE FROM caught_pokemon WHERE id = ?", [id]);
}
export async function addToParty(id: number): Promise<void> {
    await databaseConnection.execute("INSERT INTO party (id) VALUES (?)", [id]);
}
export async function removeFromParty(id: number): Promise<void> {
    await databaseConnection.execute("DELETE FROM party WHERE id = ?", [id]);
}

async function seedDatabase(): Promise<void> {
    await databaseConnection.execute(
        `CREATE TABLE IF NOT EXISTS caught_pokemon (id INT PRIMARY KEY)`
    );
    await databaseConnection.execute(
        `CREATE TABLE IF NOT EXISTS party (id INT PRIMARY KEY, FOREIGN KEY (id) REFERENCES caught_pokemon(id))`
    );
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
