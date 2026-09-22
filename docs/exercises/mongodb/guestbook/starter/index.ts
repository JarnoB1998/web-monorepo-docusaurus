import { MongoClient, type ObjectId } from "mongodb";
import readline from "readline-sync";

const uri = ""; // Fill in your MongoDB connection string here
const client = new MongoClient(uri);

interface GuestBookEntry {
    _id?: ObjectId;
    name: string;
    message: string;
    date: Date;
}

async function main() {
    try {
        await client.connect();
 
        let name: string = readline.question("What is your name? ");
        let message: string = readline.question("What is your message? ");
        let date: Date = new Date();

        const entry: GuestBookEntry = { name, message, date };

        await client.db("exercises").collection("guestbook").insertOne(entry);

        let entries : GuestBookEntry[] = await client.db("exercises").collection("guestbook").find<GuestBookEntry>({}).toArray();
        
        for (let entry of entries) {
            console.log(`[${entry.date.toLocaleString()}] ${entry.name}: ${entry.message}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();