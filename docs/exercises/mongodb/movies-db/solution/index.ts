import { MongoClient, type ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const movies : Movie[] = [
    {name: "The Matrix", myScore: 90, timesViewed: 10},
    {name: "Pulp Fuction", myScore: 100, timesViewed: 100},
    {name: "Monster Hunter", myScore: 5, timesViewed:1},
    {name: "Blade Runner", myScore: 100, timesViewed:30},
    {name: "Austin Powers", myScore: 80, timesViewed:10},
    {name: "Jurasic Park 2", myScore: 40, timesViewed:1},
    {name: "Ichi the Killer", myScore: 80, timesViewed:1}
];

interface Movie {
    _id?: ObjectId;
    name: string;
    myScore: number;
    timesViewed: number;
}

function printMovie(movie: Movie) {
    console.log(`Movie: ${movie.name}, My Score: ${movie.myScore}, Times Viewed: ${movie.timesViewed}`);
}

async function main() {
    try {
        await client.connect();
 
        // await client.db("exercises").collection("movies").insertMany(movies);

        let movie : Movie | null = await client.db("exercises").collection("movies").findOne<Movie>({});
        console.log("First movie:");
        printMovie(movie!);

        console.log("All movies:");
        const allMovies : Movie[] = await client.db("exercises").collection("movies").find<Movie>({}).toArray();
        for (let movie of allMovies) {
            printMovie(movie);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main();