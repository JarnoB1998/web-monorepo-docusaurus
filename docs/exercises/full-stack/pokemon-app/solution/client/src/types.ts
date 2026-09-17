export interface Pokemon {
    id: number;
    name: string;
    sprites: { front_default: string | null };
}
export interface PokemonLink {
    name: string;
    url: string;
}
export interface PokemonPage {
    count: number;
    results: PokemonLink[];
}
export interface OwnedPokemon {
    id: number;
    name: string;
}
