import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function runProgram() {
    await import('./index.ts');
    return vi.mocked(console.log).mock.calls.map(([x]) => String(x));
}

describe('Movies Objects — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('bevat movie.json met exact de opgegeven Matrix-data', () => {
        expect(JSON.parse(readFileSync('./movie.json', 'utf8'))).toEqual({
            title: 'The Matrix', year: 1999,
            actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
            metascore: 73, seen: true
        });
    });
    it('definieert een Movie-interface met de vereiste propertytypes', () => {
        const source = readFileSync('./index.ts', 'utf8');
        expect(source).toMatch(/interface\s+Movie\s*{[\s\S]*title\s*:\s*string[\s\S]*year\s*:\s*number[\s\S]*actors\s*:\s*string\[\][\s\S]*metascore\s*:\s*number[\s\S]*seen\s*:\s*boolean/);
    });
    it('importeert het Movie-object uit movie.json', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/import\s+\w+\s+from\s+['"]\.\/movie\.json['"]/);
    });
    it('toont alle data van de film uit het JSON-bestand', async () => {
        const output = await runProgram();
        expect(output.slice(0, 5)).toEqual([
            'Movie from file:', 'The Matrix (1999)',
            'Actors: Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
            'Metascore: 73', 'Seen: YES'
        ]);
    });
    it('maakt en toont een favoriete film van het type Movie', async () => {
        const output = await runProgram();
        expect(output).toContain('\nMy favorite movie:');
        expect(output).toContain('The Shawshank Redemption (1994)');
        expect(output).toContain('Metascore: 80');
    });
    it('maakt en toont een minst favoriete film van het type Movie', async () => {
        const output = await runProgram();
        expect(output).toContain('\nMy worst movie:');
        expect(output).toContain('The Room (2003)');
        expect(output).toContain('Metascore: 9');
    });
});
