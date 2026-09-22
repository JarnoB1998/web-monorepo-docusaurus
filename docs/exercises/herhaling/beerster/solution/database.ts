import { type Collection, MongoClient, ObjectId, type Sort, type SortDirection } from "mongodb";
import dotenv from "dotenv";
import type { Beer, Bar, Checkin, User } from "./types";
import bcrypt from "bcrypt";
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

export const checkinCollection : Collection<Checkin> = client.db("beerster").collection<Checkin>("checkins");
export const barsCollection : Collection<Bar> = client.db("beerster").collection<Bar>("bars");
export const beersCollection : Collection<Beer> = client.db("beerster").collection<Beer>("beers");
export const userCollection : Collection<User> = client.db("beerster").collection<User>("users");

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
    const user : User | null = await userCollection.findOne({ username : username });
    if (!user) {
        throw new Error("Username/password not valid");
    }
    if (!await bcrypt.compare(password, user.password!)) {
        throw new Error("Username/password not valid");
    }
    return user;
}


async function seedDatabase() {  
    let beers: Beer[] = await (await fetch("https://raw.githubusercontent.com/slimmii/mock_api/main/beers/beers.json")).json();
    let bars: Bar[] = await (await fetch("https://raw.githubusercontent.com/slimmii/mock_api/main/bars/bars.json")).json();
    let checkins: Checkin[] = await (await fetch("https://raw.githubusercontent.com/slimmii/mock_api/main/checkins/checkins.json")).json();

    if (process.env.CLEAR_DB_ON_RESTART === "true") {
        await checkinCollection.deleteMany({});
        await barsCollection.deleteMany({});
        await beersCollection.deleteMany({});

        checkins = checkins.map((checkin) => {
            checkin.beer = beers.find(beer => beer.id === checkin.beerId)!;
            checkin.bar = bars.find(bar => bar.id === checkin.barId)!;
            delete checkin.beerId;
            delete checkin.barId;
            return {
                ...checkin,
                date: new Date(checkin.date)
            }
        });



        await checkinCollection.insertMany(checkins);
        await beersCollection.insertMany(beers);
        await barsCollection.insertMany(bars);

        for (const user of initialUsers) {
            const hashedPassword = await bcrypt.hash(user.password!, 10);
            await userCollection.insertOne({ ...user, password: hashedPassword });
        }

        console.log("Database seeded");
    }
}

export async function getCheckins(sort: Sort = { date: 1 }, limit: number | undefined = undefined) {
    if (limit !== undefined) {
        return await checkinCollection.find({}).sort(sort).limit(limit).toArray();
    } else {
        return await checkinCollection.find({}).sort(sort).toArray();
    }
}

export async function getCheckinsByBar(barName: string) {
    return await checkinCollection.find({ "bar.name": barName }).toArray();
}

export async function getCheckinsByFullName(fullname: string) {
    return await checkinCollection.find({ name: fullname }).toArray();
}

export async function getCheckinsByBeer(beerName: string) {
    return await checkinCollection.find({ "beer.name": beerName }).toArray();
}

export async function getBars(sort: Sort = { name: 1 }) {
    return await barsCollection.find({}).sort(sort).toArray();
}

export async function getTopThreeBars() {
    return await barsCollection.find({}).sort({ rating: -1 }).limit(3).toArray();
}

export async function getBeers() {
    return await beersCollection.find({}).toArray();
}

export async function getBarById(id: number) {
    return await barsCollection.findOne({ id: id });
}

export async function getBeerById(id: number) {
    return await beersCollection.findOne({ id: id });
}

export async function createCheckin(barId: number, beerId: number, comment: string, date: Date, name: string = "Anonymous") {
    let bar : Bar | null = await getBarById(barId);
    if (!bar) {
        throw new Error("Bar not found");
    }
    let beer : Beer | null = await getBeerById(beerId);
    if (!beer) {
        throw new Error("Beer not found");
    }

    let ids = (await checkinCollection.find().sort({ id: -1 }).limit(1).toArray());
    let maxId : number = ids.length < 1 ? 0 : ids[0].id!;

    let randomImage: string = bar.images[Math.floor(Math.random() * bar.images.length)];

    const newCheckin : Checkin = {
        id: maxId + 1,
        name: name,
        bar: bar,
        beer: beer,
        comment: comment,
        date: date,
        image: randomImage
    }

    await checkinCollection.insertOne(newCheckin);
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