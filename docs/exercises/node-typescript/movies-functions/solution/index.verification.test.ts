import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Movie = { title: string; year: number; actors: string[]; metascore: number; seen: boolean };
type MovieFunctions = {
    wasMovieMadeInThe90s(movie: Movie): boolean;
    averageMetaScore(movies: Movie[]): number;
    fakeMetaScore(movie: Movie, score: number): Movie;
};

async function loadFunctions(): Promise<MovieFunctions> {
    const movieData = JSON.parse(readFileSync('./movie.json', 'utf8'));
    let source = readFileSync('./index.ts', 'utf8')
        .replace(/^import\s+data[^\n]*$/m, `const data = ${JSON.stringify(movieData)};`)
        .replace(/export\s*{\s*}\s*;?/g, '');
    source += '\nglobalThis.__verificationFunctions = { wasMovieMadeInThe90s, averageMetaScore, fakeMetaScore };';
    const directory = mkdtempSync(join(tmpdir(), 'movies-functions-verification-'));
    const modulePath = join(directory, 'instrumented.ts');
    try {
        writeFileSync(modulePath, source);
        await import(pathToFileURL(modulePath).href);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
    return (globalThis as typeof globalThis & { __verificationFunctions: MovieFunctions }).__verificationFunctions;
}

const movie = (year: number, metascore = 50): Movie => ({ title: 'Test', year, actors: [], metascore, seen: false });

describe('Movies Functions — verificatie', () => {
    beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));
    afterEach(() => { vi.restoreAllMocks(); delete (globalThis as { __verificationFunctions?: MovieFunctions }).__verificationFunctions; });

    it('herkent 1990 als het begin van de jaren 90', async () => { expect((await loadFunctions()).wasMovieMadeInThe90s(movie(1990))).toBe(true); });
    it('herkent 1999 als het einde van de jaren 90', async () => { expect((await loadFunctions()).wasMovieMadeInThe90s(movie(1999))).toBe(true); });
    it('weigert jaren vóór 1990', async () => { expect((await loadFunctions()).wasMovieMadeInThe90s(movie(1989))).toBe(false); });
    it('weigert jaren vanaf 2000', async () => { expect((await loadFunctions()).wasMovieMadeInThe90s(movie(2000))).toBe(false); });
    it('berekent de gemiddelde metascore van alle films', async () => {
        expect((await loadFunctions()).averageMetaScore([movie(2000, 73), movie(2001, 80), movie(2002, 9)])).toBe(54);
    });
    it('maakt een nieuw Movie-object met de vervalste score', async () => {
        const original = movie(1999, 73);
        expect((await loadFunctions()).fakeMetaScore(original, 100)).toEqual({ ...original, metascore: 100 });
    });
    it('wijzigt het oorspronkelijke Movie-object niet', async () => {
        const original = movie(1999, 73);
        const result = (await loadFunctions()).fakeMetaScore(original, 100);
        expect(result).not.toBe(original);
        expect(original.metascore).toBe(73);
    });
    it('print de drie gevraagde demonstratieresultaten', async () => {
        await loadFunctions();
        expect(console.log).toHaveBeenCalledTimes(3);
    });
});
