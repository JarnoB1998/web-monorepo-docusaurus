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
    results: PokemonLink[];
}
