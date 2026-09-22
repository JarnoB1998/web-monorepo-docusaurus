import { type Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import type { TeamPokemon } from "./types";
dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

export const collection : Collection<TeamPokemon> = client.db("exercises").collection<TeamPokemon>("pokemon-team");

export async function getTeam() {
    return await collection.find({}).toArray();
}

export async function addToTeam(pokemon: string) {
    let pokemonFound = (await collection.findOne({pokemon: pokemon})) !== null;
    if (!pokemonFound) {
        await collection.insertOne({ pokemon: pokemon });
    } else {
        throw new Error("Pokemon already in team");
    }
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