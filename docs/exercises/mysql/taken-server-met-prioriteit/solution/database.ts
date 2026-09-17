import mysql, {
    Connection,
    ConnectionOptions,
    RowDataPacket,
    FieldPacket,
    ResultSetHeader
} from "mysql2/promise";
import dotenv from "dotenv";
import { Taak } from "./types";

dotenv.config();
const access: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? "3306"),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "taken_prioriteit"
};
let databaseConnection: Connection;

export async function getTaken(): Promise<Taak[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT * FROM taken ORDER BY prioriteit"
    );
    return rows as Taak[];
}
export async function getEersteTaak(): Promise<Taak | undefined> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT * FROM taken ORDER BY prioriteit LIMIT 1"
    );
    return rows[0] as Taak | undefined;
}
export async function createTaak(
    omschrijving: string,
    naam: string,
    urgent: boolean = false
): Promise<Taak | undefined> {
    const taken: Taak[] = await getTaken();
    let prioriteit: number = taken.length + 1;
    if (urgent) {
        // Van hoog naar laag, zodat de unieke prioriteiten elkaar niet overlappen.
        await databaseConnection.execute(
            "UPDATE taken SET prioriteit = prioriteit + 1 ORDER BY prioriteit DESC"
        );
        prioriteit = 1;
    }
    const [result]: [ResultSetHeader, FieldPacket[]] = await databaseConnection.execute(
        "INSERT INTO taken (omschrijving, naam, prioriteit) VALUES (?, ?, ?)",
        [omschrijving, naam, prioriteit]
    );
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT * FROM taken WHERE id = ?",
        [result.insertId]
    );
    return rows[0] as Taak | undefined;
}
export async function deleteEersteTaak(): Promise<Taak | undefined> {
    const taak: Taak | undefined = await getEersteTaak();
    if (!taak) return undefined;
    await databaseConnection.execute("DELETE FROM taken WHERE id = ?", [taak.id]);
    await databaseConnection.execute(
        "UPDATE taken SET prioriteit = prioriteit - 1 ORDER BY prioriteit ASC"
    );
    return taak;
}

async function seedDatabase(): Promise<void> {
    await databaseConnection.execute(`CREATE TABLE IF NOT EXISTS taken (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        omschrijving VARCHAR(255) NOT NULL,
        naam VARCHAR(100) NOT NULL,
        prioriteit INT NOT NULL UNIQUE
    )`);
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
