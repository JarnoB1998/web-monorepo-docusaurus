import { type Collection, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import type { Player, PokeApiPokemon, Pokemon } from "./types";
dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

export const playerCollection : Collection<Player> = client.db("pokedex").collection<Player>("players");
export const pokemonCollection :  Collection<Pokemon> = client.db("pokedex").collection<Pokemon>("pokemon");

let playerCache : Player[] = [];

export function getPlayer(id: string) {
    return playerCache.find(player => player._id?.toString() === id);
}

export async function savePlayer(id: string) {
    playerCollection.updateOne({_id: new ObjectId(id)}, {$set: {pokemon: getPlayer(id)?.pokemon}});
}

export async function getPlayers() {
    return playerCollection.find({}).toArray();
}

export async function getPokemon() {
    return pokemonCollection.find({}).toArray();
}

export async function getPokemonById(id: number) {
    return pokemonCollection.findOne<Pokemon>({id: id});
}

export async function createPlayer(player: Player) {
    await playerCollection.insertOne(player);
    await loadPlayersToCache();
}

async function loadPlayersToCache() {
    playerCache = await playerCollection.find({}).toArray();
}


async function loadPokemonToDatabase() {
    let pokemon = await pokemonCollection.find({}).toArray();
    if (pokemon.length === 0) {
        console.log("Loading pokemon to database");
        let pokemonList : Pokemon[] = [];
        for (let i=1; i<151;i++) {
            let response = await fetch("https://pokeapi.co/api/v2/pokemon/" + i)
            let poke: PokeApiPokemon = await response.json();
            let pokemon: Pokemon = {
                id: poke.id,
                name: poke.name,
                types: poke.types.map((type) => type.type.name),
                image: poke.sprites.front_default,
                height: poke.height,
                weight: poke.weight,
                maxHP: poke.stats[0].base_stat
            }
            pokemonList.push(pokemon)
            console.log("Loaded " + pokemon.name + " into database");
        }
        await pokemonCollection.insertMany(pokemonList);
    }
}

async function exit() {
    try {
        await client.close();
        await loadPokemonToDatabase();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        await loadPokemonToDatabase();
        await loadPlayersToCache();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}