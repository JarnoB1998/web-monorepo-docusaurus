import mysql, {
    type Connection,
    type ConnectionOptions,
    type RowDataPacket,
    type FieldPacket,
    type ResultSetHeader
} from "mysql2/promise";
import dotenv from "dotenv";
import type { Pokemon } from "./types";

dotenv.config();
const access: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? "3306"),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "pokemon_app"
};
let databaseConnection: Connection;

export async function getPokemon(): Promise<Pokemon[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id, name FROM pokemon ORDER BY id"
    );
    return rows as Pokemon[];
}
export async function getPokemonById(id: number): Promise<Pokemon | undefined> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id, name FROM pokemon WHERE id = ?",
        [id]
    );
    return rows[0] as Pokemon | undefined;
}
export async function catchPokemon(id: number, name: string): Promise<void> {
    await databaseConnection.execute("INSERT INTO pokemon (id, name) VALUES (?, ?)", [id, name]);
}
export async function releasePokemon(id: number): Promise<void> {
    await databaseConnection.execute("DELETE FROM pokemon WHERE id = ?", [id]);
}

async function seedDatabase(): Promise<void> {
    await databaseConnection.execute(
        `CREATE TABLE IF NOT EXISTS pokemon (id INT PRIMARY KEY, name VARCHAR(100) NOT NULL)`
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
