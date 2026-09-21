import data from './movie.json' with { type: "json" };

interface Movie {
    title: string;
    year: number;
    actors: string[];
    metascore: number;
    seen: boolean;
}

const matrix: Movie = data;


function wasMovieMadeInThe90s(movie: Movie) {
    return (movie.year >= 1990 && movie.year < 2000);
} 

function averageMetaScore(movies: Movie[]) {
    let sum = 0;
    for (let movie of movies) {
        sum += movie.metascore;
    }
    return sum / movies.length;
}

function fakeMetaScore(movie: Movie, newScore: number) {
    return {
        title: movie.title,
        year: movie.year,
        actors: movie.actors,
        metascore: newScore,
        seen: movie.seen
    }
}

const myFavoriteMovie: Movie = {
    title: 'The Shawshank Redemption',
    year: 1994,
    actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    metascore: 80,
    seen: true
};

const myWorstMovie: Movie = {
    title: 'The Room',
    year: 2003,
    actors: ['Tommy Wiseau', 'Juliette Danielle', 'Greg Sestero'],
    metascore: 9,
    seen: true
};

let movies: Movie[] = [myFavoriteMovie, myWorstMovie, matrix];

console.log(wasMovieMadeInThe90s(movies[0]));
console.log(averageMetaScore(movies));
console.log(fakeMetaScore(movies[0], 100));


export {}