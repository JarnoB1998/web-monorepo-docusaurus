import { MongoClient, type Collection, type ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

interface Game {
    _id?: ObjectId;
    name: string;
    price: number;
    releaseDate: Date;
    rating: number;
    publisher: string;
}

let data: Game[] = [
    {
        name: 'The Witcher 3: Wild Hunt',
        price: 39.99,
        releaseDate: new Date('2015-05-19'),
        rating: 9.3,
        publisher: 'CD Projekt',
    },
    {
        name: 'Red Dead Redemption 2',
        price: 59.99,
        releaseDate: new Date('2018-10-26'),
        rating: 9.7,
        publisher: 'Rockstar Games',
    },
    {
        name: 'The Legend of Zelda: Breath of the Wild',
        price: 59.99,
        releaseDate: new Date('2017-03-03'),
        rating: 9.6,
        publisher: 'Nintendo',
    },
    {
        name: 'The Elder Scrolls V: Skyrim',
        price: 39.99,
        releaseDate: new Date('2011-11-11'),
        rating: 9.5,
        publisher: 'Bethesda Softworks',
    },
    {
        name: 'The Last of Us Part II',
        price: 59.99,
        releaseDate: new Date('2020-06-19'),
        rating: 9.2,
        publisher: 'Sony Interactive Entertainment',
    },
    {
        name: 'God of War',
        price: 39.99,
        releaseDate: new Date('2018-04-20'),
        rating: 9.4,
        publisher: 'Sony Interactive Entertainment',
    },
    {
        name: 'Dark Souls III',
        price: 59.99,
        releaseDate: new Date('2016-04-12'),
        rating: 9.1,
        publisher: 'FromSoftware',
    },
    {
        name: 'Grand Theft Auto V',
        price: 29.99,
        releaseDate: new Date('2013-09-17'),
        rating: 9.8,
        publisher: 'Rockstar Games',
    },
];

async function showGamesByPublisher(collection: Collection<Game>, publisher: string) {
    let games: Game[] = await collection.find({ publisher: publisher }).toArray();

    console.table(games, ["name", "price", "releaseDate", "rating"]);
}

async function showAllGames(collection: Collection<Game>, sort: string = "name") {
    let games: Game[] = await collection.find({}).sort({[sort]: 1}).toArray();

    console.table(games, ["name", "price", "releaseDate", "rating"]);
}

async function showGamesCheaperThan(collection: Collection<Game>, price: number) {
    let games: Game[] = await collection.find({ price: { $lt: price } }).toArray();

    console.table(games, ["name", "price", "releaseDate", "rating"]);
}

async function showHighestRatedGame(collection: Collection<Game>) {
    let games: Game[] = await collection.find<Game>({}).sort({ rating: -1 }).limit(1).toArray();

    console.table(games, ["name", "price", "releaseDate", "rating"]);

}

async function showGamesWithPriceBetween(collection: Collection<Game>, minPrice: number, maxPrice: number) {
    let games: Game[] = await collection.find({$and: [{ price: { $gte: minPrice }} , {price: { $lte: maxPrice}}]}).toArray();

    console.table(games, ["name", "price", "releaseDate", "rating"]);
}

async function discountAllGames(collection: Collection<Game>, discount: number) {
    let games: Game[] = await collection.find({}).toArray();
    for (let game of games) {
        game.price = game.price - game.price * discount / 100;

        await collection.updateOne({ _id: game._id }, { $set: { price: game.price } });
    }
};

async function main() {
    try {
        await client.connect();
        console.log("Connected to the database");
        
        let collection: Collection<Game> = client.db("exercises").collection<Game>("games-db");

        if ((await collection.find({}).toArray()).length === 0) {
            await collection.insertMany(data);
        }

        await showAllGames(collection);

        await showGamesByPublisher(collection, "Sony Interactive Entertainment");

        await showGamesCheaperThan(collection, 40);

        await showAllGames(collection, "price");
        await showAllGames(collection, "rating");

        await showHighestRatedGame(collection);

        await showGamesWithPriceBetween(collection, 40, 60);

        await showAllGames(collection);

        await discountAllGames(collection, 10);

        await showAllGames(collection);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main();
export {}