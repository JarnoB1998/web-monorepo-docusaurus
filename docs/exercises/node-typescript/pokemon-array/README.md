# Pokémon array

Maak een nieuw TypeScript-project aan met een bestand `index.ts`. Vertrek van deze lijst van Pokémon.

Los de vragen op, maak enkel gebruik van de array methods en geen for-loop. Gebruik chaining waar mogelijk.

```typescript
interface Pokemon {
  name: string;
  type: string;
  level: number;
  caughtDate: Date | null;
}

const pokemons: Pokemon[] = [
  { name: 'Charmander', type: 'Fire', level: 12, caughtDate: new Date('2024-01-10') },
  { name: 'Squirtle', type: 'Water', level: 10, caughtDate: new Date('2024-02-15') },
  { name: 'Pikachu', type: 'Electric', level: 18, caughtDate: null },
  { name: 'Vulpix', type: 'Fire', level: 15, caughtDate: new Date('2024-03-05') },
  { name: 'Bulbasaur', type: 'Grass', level: 14, caughtDate: new Date('2024-04-01') },
  { name: 'Growlithe', type: 'Fire', level: 22, caughtDate: null },
  { name: 'Pidgey', type: 'Normal', level: 8, caughtDate: new Date('2024-05-01') },
  { name: 'Magmar', type: 'Fire', level: 30, caughtDate: new Date('2024-01-25') },
  { name: 'Jigglypuff', type: 'Fairy', level: 11, caughtDate: null },
  { name: 'Psyduck', type: 'Water', level: 16, caughtDate: new Date('2024-03-20') }
];

```

1. **Toon enkel gevangen Pokémon**

2. **Toon enkel niet-gevangen Pokémon**

3. **Lijst van namen van niet-gevangen Pokémon**

4. **Aantal gevangen Pokémon**

5. **Zijn er nog ongevangen Fire-types?**

6. **Zijn alle Water-types gevangen?**

7. **Som van levels van alle gevangen Pokémon**

8. **Gemiddeld level van niet-gevangen Pokémon**

9. **Sorteer gevangen Pokémon van oud naar recent (op caughtDate)**
