import { type Collection, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import type { Player, PokeApiPokemon, Pokemon } from "./types";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export const client = new MongoClient(MONGODB_URI);

export const playerCollection : Collection<Player> = client.db("pokedex").collection<Player>("players");
export const pokemonCollection :  Collection<Pokemon> = client.db("pokedex").collection<Pokemon>("pokemon");

export async function getPlayer(id: string) {
    return playerCollection.findOne({_id: new ObjectId(id)});
}

export async function savePlayer(player: Player) {
    playerCollection.updateOne({_id: new ObjectId(player._id)}, {$set: player});
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
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}