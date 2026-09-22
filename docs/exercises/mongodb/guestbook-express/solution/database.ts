import { type Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import type { GuestBookEntry } from "./types";
dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

export const collection : Collection<GuestBookEntry> = client.db("exercises").collection<GuestBookEntry>("guestbook");

export async function getGuestBookEntries() {
    return await collection.find({}).sort({date: -1}).toArray();
}

export async function createGuestBookEntry(entry: GuestBookEntry) {
    await collection.insertOne(entry);
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}


export async function connect() {
    try {
        await client.connect();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}