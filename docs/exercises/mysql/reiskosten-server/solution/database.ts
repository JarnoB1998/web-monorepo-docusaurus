import mysql, {
    Connection,
    ConnectionOptions,
    RowDataPacket,
    FieldPacket,
    ResultSetHeader
} from "mysql2/promise";
import dotenv from "dotenv";
import { ReisRecord, KostData } from "./types";
import { Reis } from "./models/Reis";
import { Kost } from "./models/Kost";

dotenv.config();
const access: ConnectionOptions = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? "3306"),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "reiskosten"
};
let databaseConnection: Connection;

export async function getReizen(): Promise<Reis[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id, bestemming, jaar FROM reizen ORDER BY id"
    );
    const records: ReisRecord[] = rows as ReisRecord[];
    const reizen: Reis[] = [];
    for (const record of records) {
        const reis: Reis | undefined = await getReisById(record.id);
        if (reis) reizen.push(reis);
    }
    return reizen;
}

export async function getReisById(id: number): Promise<Reis | undefined> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT id, bestemming, jaar FROM reizen WHERE id = ?",
        [id]
    );
    const record: ReisRecord | undefined = rows[0] as ReisRecord | undefined;
    if (!record) return undefined;
    const reis: Reis = new Reis(record.id, record.bestemming, record.jaar);
    const [kostRows]: [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT uitgave, prijs FROM kosten WHERE reis_id = ? ORDER BY id",
        [id]
    );
    const kosten: KostData[] = kostRows as KostData[];
    for (const kost of kosten) reis.voegKostToe(new Kost(kost.uitgave, kost.prijs));
    return reis;
}

export async function createReis(bestemming: string, jaar: number): Promise<Reis | undefined> {
    const [result]: [ResultSetHeader, FieldPacket[]] = await databaseConnection.execute(
        "INSERT INTO reizen (bestemming, jaar) VALUES (?, ?)",
        [bestemming, jaar]
    );
    return await getReisById(result.insertId);
}

export async function addKost(
    id: number,
    uitgave: string,
    prijs: number
): Promise<Reis | undefined> {
    const reis: Reis | undefined = await getReisById(id);
    if (!reis) return undefined;
    await databaseConnection.execute(
        "INSERT INTO kosten (reis_id, uitgave, prijs) VALUES (?, ?, ?)",
        [id, uitgave, prijs]
    );
    return await getReisById(id);
}

async function seedDatabase(): Promise<void> {
    await databaseConnection.execute(`CREATE TABLE IF NOT EXISTS reizen (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        bestemming VARCHAR(100) NOT NULL,
        jaar INT NOT NULL
    )`);
    await databaseConnection.execute(`CREATE TABLE IF NOT EXISTS kosten (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        reis_id INT UNSIGNED NOT NULL,
        uitgave VARCHAR(100) NOT NULL,
        prijs DOUBLE NOT NULL,
        FOREIGN KEY (reis_id) REFERENCES reizen(id)
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
