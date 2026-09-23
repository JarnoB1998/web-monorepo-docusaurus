
interface Ingredient {
  naam: string;
  hoeveelheid: string;
  prijs: number;
}

interface Recept {
  naam: string;
  beschrijving: string;
  personen: number;
  ingredienten: Ingredient[];
}

const lasagne: Recept = {
  naam: 'Lasagne',
  beschrijving: 'Lekkere lasagne',
  personen: 4,
  ingredienten: [
    { naam: '1 pak lasagnevellen', hoeveelheid: '1 stuk', prijs: 3 },
    { naam: '500g gehakt', hoeveelheid: '500g', prijs: 5 },
    { naam: '1 ui', hoeveelheid: '1 stuk', prijs: 1 },
    { naam: '1 teentje look', hoeveelheid: '1 stuk', prijs: 1 }
  ]
};

console.log(`Recept: ${lasagne.naam}`);
console.log(`Beschrijving: ${lasagne.beschrijving}`);
console.log(`Personen: ${lasagne.personen}`);
console.log(`Ingredienten:`);
for (const ingredient of lasagne.ingredienten) {
    console.log(`- ${ingredient.naam}`);
}

let totaleKostprijs: number = 0;
for (const ingredient of lasagne.ingredienten) {
    totaleKostprijs += ingredient.prijs;
}
console.log(`Totale kostprijs: ${totaleKostprijs} euro`);

export {}
