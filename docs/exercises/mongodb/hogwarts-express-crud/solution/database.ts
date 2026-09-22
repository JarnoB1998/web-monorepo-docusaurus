import { type Collection, MongoClient, type SortDirection } from "mongodb";
import dotenv from "dotenv";
import type { Spell } from "./types";

dotenv.config();

const CONNECTION_STRING: string = process.env.CONNECTION_STRING ?? "mongodb://localhost:27017";

const client = new MongoClient(CONNECTION_STRING);

export const spellsCollection: Collection<Spell> = client.db("HarryPotter").collection("Spells");


export async function getSpells(q: string = "", sortField: string, sortDirection: SortDirection) {

    const regexp = new RegExp(`.*${q}.*`, "i");
    const query = q === "" ? {} : {$or: [{name: regexp}, {description: regexp}, {type: regexp}]};

    return spellsCollection.find<Spell>(query).sort({[sortField]: sortDirection}).collation({locale: "en"}).toArray();
}

export async function getSpellById(id: number) {
    return spellsCollection.findOne({id: id});
}

export async function deleteSpellById(id: number) {
    return spellsCollection.deleteOne({ id : id});
}

export async function updateSpellById(id: number, spell: Spell) {
    return spellsCollection.updateOne({id: id}, {$set: spell});
}

export async function createSpell(spell: Spell) {
    const maxId : number = (await spellsCollection.findOne({}, {sort: {id: -1}}))?.id ?? 0;

    spell.id = maxId + 1;

    return spellsCollection.insertOne(spell);
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

export async function seed() {
    await spellsCollection.deleteMany({});
    if (await spellsCollection.countDocuments() === 0) {
        // https://sampleapis.assimilate.be/harrypotter/spells
        const response = await fetch("https://sampleapis.assimilate.be/harrypotter/spells");
        const json : Spell[] = await response.json();

        const insertResult = await spellsCollection.insertMany(json);

        console.log(`Inserted ${insertResult.insertedCount} into the database`);

    }
}

export async function connect() {
    try {
        await client.connect();


        await spellsCollection.dropIndex("*");
        await spellsCollection.createIndex({name: "text", description: "text", type: "text"});

        console.log("Connected to the database");
        await seed();
        process.on("SIGINT", exit);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}