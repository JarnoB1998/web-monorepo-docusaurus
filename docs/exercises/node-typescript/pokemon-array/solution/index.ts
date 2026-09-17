interface Pokemon {
    name: string;
    type: string;
    level: number;
    caughtDate: Date | null;
}

const pokemons: Pokemon[] = [
    { name: "Charmander", type: "Fire", level: 12, caughtDate: new Date("2024-01-10") },
    { name: "Squirtle", type: "Water", level: 10, caughtDate: new Date("2024-02-15") },
    { name: "Pikachu", type: "Electric", level: 18, caughtDate: null },
    { name: "Vulpix", type: "Fire", level: 15, caughtDate: new Date("2024-03-05") },
    { name: "Bulbasaur", type: "Grass", level: 14, caughtDate: new Date("2024-04-01") },
    { name: "Growlithe", type: "Fire", level: 22, caughtDate: null },
    { name: "Pidgey", type: "Normal", level: 8, caughtDate: new Date("2024-05-01") },
    { name: "Magmar", type: "Fire", level: 30, caughtDate: new Date("2024-01-25") },
    { name: "Jigglypuff", type: "Fairy", level: 11, caughtDate: null },
    { name: "Psyduck", type: "Water", level: 16, caughtDate: new Date("2024-03-20") }
];

// 1. Gevangen Pokémon
const caught: Pokemon[] = pokemons.filter(
    (pokemon: Pokemon): boolean => pokemon.caughtDate !== null
);
console.log("1. Gevangen:", caught);

// 2. Niet-gevangen Pokémon
const notCaught: Pokemon[] = pokemons.filter(
    (pokemon: Pokemon): boolean => pokemon.caughtDate === null
);
console.log("2. Niet gevangen:", notCaught);

// 3. Namen van niet-gevangen Pokémon
const names: string[] = pokemons
    .filter((pokemon: Pokemon): boolean => pokemon.caughtDate === null)
    .map((pokemon: Pokemon): string => pokemon.name);
console.log("3. Namen:", names);

// 4. Aantal gevangen Pokémon
console.log("4. Aantal gevangen:", caught.length);

// 5. Minstens één ongevangen Fire-type?
const uncaughtFire: boolean =
    pokemons.filter(
        (pokemon: Pokemon): boolean => pokemon.type === "Fire" && pokemon.caughtDate === null
    ).length > 0;
console.log("5. Ongevangen Fire-type:", uncaughtFire);

// 6. Alle Water-types gevangen? Er mogen geen ongevangen Water-types zijn.
const allWaterCaught: boolean =
    pokemons.filter(
        (pokemon: Pokemon): boolean => pokemon.type === "Water" && pokemon.caughtDate === null
    ).length === 0;
console.log("6. Alle Water-types gevangen:", allWaterCaught);

// 7. Som van levels van gevangen Pokémon
const total: number = caught.reduce(
    (sum: number, pokemon: Pokemon): number => sum + pokemon.level,
    0
);
console.log("7. Som levels:", total);

// 8. Gemiddeld level van niet-gevangen Pokémon
const average: number =
    notCaught.length === 0
        ? 0
        : notCaught.reduce((sum: number, pokemon: Pokemon): number => sum + pokemon.level, 0) /
          notCaught.length;
console.log("8. Gemiddeld level:", average);

// 9. Filter levert een nieuwe array op. Sorteren wijzigt de oorspronkelijke lijst niet.
const sorted: Pokemon[] = pokemons
    .filter((pokemon: Pokemon): boolean => pokemon.caughtDate !== null)
    .sort((a: Pokemon, b: Pokemon): number => {
        if (a.caughtDate === null || b.caughtDate === null) return 0;
        if (a.caughtDate < b.caughtDate) return -1;
        if (a.caughtDate > b.caughtDate) return 1;
        return 0;
    });
console.log("9. Van oud naar recent:", sorted);
