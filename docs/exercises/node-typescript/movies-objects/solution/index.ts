import data from './movie.json' with { type: "json" };

interface Movie {
    title: string;
    year: number;
    actors: string[];
    metascore: number;
    seen: boolean;
}

const movie: Movie = data;

console.log(`Movie from file:`);
console.log(`${movie.title} (${movie.year})`);
console.log(`Actors: ${movie.actors.join(', ')}`);
console.log(`Metascore: ${movie.metascore}`);
console.log(`Seen: ${movie.seen ? 'YES' : 'NO'}`);

const myFavoriteMovie: Movie = {
    title: 'The Shawshank Redemption',
    year: 1994,
    actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    metascore: 80,
    seen: true
};

console.log(`\nMy favorite movie:`);
console.log(`${myFavoriteMovie.title} (${myFavoriteMovie.year})`);
console.log(`Actors: ${myFavoriteMovie.actors.join(', ')}`);
console.log(`Metascore: ${myFavoriteMovie.metascore}`);
console.log(`Seen: ${myFavoriteMovie.seen ? 'YES' : 'NO'}`);

const myWorstMovie: Movie = {
    title: 'The Room',
    year: 2003,
    actors: ['Tommy Wiseau', 'Juliette Danielle', 'Greg Sestero'],
    metascore: 9,
    seen: true
};

console.log(`\nMy worst movie:`);
console.log(`${myWorstMovie.title} (${myWorstMovie.year})`);
console.log(`Actors: ${myWorstMovie.actors.join(', ')}`);
console.log(`Metascore: ${myWorstMovie.metascore}`);
console.log(`Seen: ${myWorstMovie.seen ? 'YES' : 'NO'}`);

export {}