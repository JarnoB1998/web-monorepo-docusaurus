import readline from "readline-sync";
import { type Collection, MongoClient, type ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let pokemon: string[] = [
    "Bulbasaur",
    "Ivysaur",
    "Venusaur",
    "Charmander",
    "Charmeleon",
    "Charizard",
    "Squirtle",
    "Wartortle",
    "Blastoise",
    "Caterpie",
    "Metapod",
    "Butterfree",
    "Weedle",
    "Kakuna",
    "Beedrill",
    "Pidgey",
    "Pidgeotto",
    "Pidgeot",
    "Rattata",
    "Raticate",
    "Spearow",
];

interface TeamPokemon {
    _id?: ObjectId;
    pokemon: string;
}

async function main() {
    try {
        let collection: Collection<TeamPokemon> = client.db("exercises").collection<TeamPokemon>("pokemon-team");
        let team: TeamPokemon[] = await collection.find<TeamPokemon>({}).toArray();
        let running = true;

        for (let i = 0; i < pokemon.length; i++) {
            console.log(`${i}. ${pokemon[i]}`);
        }

        do {
            let input: string = readline.question("Welke pokemon wil je in je team? [0-20]:");

            if (input.toUpperCase() === "STOP") {
                running = false;
            } else {
                let index: number = parseInt(input);

                let pokemonInTeam: TeamPokemon | null = await collection.findOne<TeamPokemon>({ pokemon: pokemon[index] });
                if (index < 0 || index >= pokemon.length || isNaN(index)) {
                    console.log("Deze pokemon ken ik niet");
                } else if (pokemonInTeam) {
                    console.log("Deze pokemon zit al in je team");
                } else {
                    let member: TeamPokemon = { pokemon: pokemon[index] };
                    await collection.insertOne(member);
                }
            }

        } while (running);

        console.log("Jouw team van pokemon is: ");
        let pokeTeam: TeamPokemon[] = await collection.find<TeamPokemon>({}).toArray();
        for (let i = 0; i < pokeTeam.length; i++) {
            console.log(`${i + 1}. ${pokeTeam[i].pokemon}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

}
main();

export { }