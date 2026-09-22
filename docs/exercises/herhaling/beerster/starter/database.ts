import dotenv from "dotenv";
import { MongoClient, type Sort } from "mongodb";
import type { User } from "./types";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
export const client = new MongoClient(MONGODB_URI);

const initialUsers: User[] = [
    {
        username: "solo",
        fullname: "Han Solo",
        password: "hanshotfirst"
    },
    {
        username: "princess",
        fullname: "Leia Organa",
        password: "obiwan"
    }
];

export async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function login(username: string, password: string) {
  
}


async function seedDatabase() {  
    
}

export async function getCheckins(sort: Sort = { date: 1 }, limit: number | undefined = undefined) {
   
}

export async function getCheckinsByBar(barName: string) {
}

export async function getCheckinsByFullName(fullname: string) {
}

export async function getCheckinsByBeer(beerName: string) {
}

export async function getBars(sort: Sort = { name: 1 }) {
}

export async function getTopThreeBars() {
}

export async function getBeers() {
}

export async function getBarById(id: number) {
}

export async function getBeerById(id: number) {
}

export async function createCheckin(barId: number, beerId: number, comment: string, date: Date, name: string = "Anonymous") {
    
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