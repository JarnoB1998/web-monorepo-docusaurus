import { type Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import type { Pet } from "./types";
dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

export const collection : Collection<Pet> = client.db("exercises").collection<Pet>("pet-shelter");

export async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

async function seedDatabase() {
    await collection.deleteMany({});
    await collection.dropIndex("*");
    await collection.createIndex({ breed: "text", name: "text", type: "text"});
    const pets : Pet[] = [
        { name: "Buddy", age: 2, type: "dog", breed: "Golden Retriever" },
        { name: "Daisy", age: 3, type: "dog", breed: "Beagle" },
        { name: "Coco", age: 1, type: "dog", breed: "Poodle" },
        { name: "Charlie", age: 2, type: "cat", breed: "Siamese" },
        { name: "Luna", age: 3, type: "cat", breed: "Persian" },
        { name: "Lucy", age: 1, type: "cat", breed: "Maine Coon" },
        { name: "Max", age: 4, type: "dog", breed: "Labrador Retriever" },
        { name: "Bella", age: 2, type: "dog", breed: "French Bulldog" },
        { name: "Milo", age: 1, type: "dog", breed: "Border Collie" },
        { name: "Oliver", age: 3, type: "cat", breed: "Bengal" },
        { name: "Tiger", age: 2, type: "cat", breed: "Ragdoll" },
        { name: "Zoe", age: 3, type: "cat", breed: "Sphynx" },
        { name: "Sophie", age: 5, type: "dog", breed: "Dachshund" },
        { name: "Lily", age: 1, type: "cat", breed: "British Shorthair" },
        { name: "Oscar", age: 4, type: "dog", breed: "Boxer" },
        { name: "Ruby", age: 2, type: "dog", breed: "Siberian Husky" },
        { name: "Rosie", age: 2, type: "cat", breed: "Scottish Fold" },
        { name: "Jack", age: 3, type: "dog", breed: "Cocker Spaniel" },
        { name: "Sadie", age: 2, type: "dog", breed: "Rottweiler" },
        { name: "Maggie", age: 1, type: "dog", breed: "Shih Tzu" }
    ];
    await collection.insertMany(pets);
}

export async function getPets() {
    return await collection.find({}).toArray();
}

export async function getPetsByType(type: string) {
    return await collection.find({ type: type }).toArray();
}

export async function searchPets(q: string) {
    return await collection.find({ $text: { $search: q } }).toArray();
}

export async function getPetsWithAgeBetween(min: number, max: number) {
    return await collection.find({ age: { $gte: min, $lte: max } }).sort({age: 1}).toArray();
}

export async function getSortedPets(field: string) {
    if (field === "name") {
        return await collection.find({}).sort({ name: 1 }).toArray();
    } else if (field === "age") {
        return await collection.find({}).sort({ age: 1 }).toArray();
    } else if (field === "type") {
        return await collection.find({}).sort({ type: 1 }).toArray();
    } else if (field === "breed") {
        return await collection.find({}).sort({ breed: 1 }).toArray();
    } else {
        throw new Error("Invalid field");
    }
    // return await collection.find({}).sort({ [field]: 1 }).toArray(); // shorter
}

export async function connect() {
    try {
        await client.connect();
        console.log("Connected to database");
        await seedDatabase();
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}