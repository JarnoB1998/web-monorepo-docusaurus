import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type FilterFunctions = {
    filterPositive(values: number[]): number[];
    filterNegative(values: number[]): number[];
    filterEven(values: number[]): number[];
    filter(values: number[], predicate: (value: number) => boolean): number[];
};

async function loadFunctions(): Promise<FilterFunctions> {
    const source = readFileSync('./index.ts', 'utf8').replace(/export\s*{\s*}\s*;?/g, '');
    const directory = mkdtempSync(join(tmpdir(), 'filter-numbers-verification-'));
    const modulePath = join(directory, 'instrumented.ts');
    try {
        writeFileSync(modulePath, `${source}\nglobalThis.__verificationFunctions = { filterPositive, filterNegative, filterEven, filter };`);
        await import(pathToFileURL(modulePath).href);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
    return (globalThis as typeof globalThis & { __verificationFunctions: FilterFunctions }).__verificationFunctions;
}

const example = [-4, -4, 1, 2, 3, 4, 5];

describe('Filter Numbers — verificatie', () => {
    beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));
    afterEach(() => { vi.restoreAllMocks(); delete (globalThis as { __verificationFunctions?: FilterFunctions }).__verificationFunctions; });

    it('filterPositive geeft uitsluitend positieve getallen terug', async () => {
        expect((await loadFunctions()).filterPositive(example)).toEqual([1, 2, 3, 4, 5]);
    });
    it('filterPositive beschouwt nul niet als positief', async () => {
        expect((await loadFunctions()).filterPositive([-1, 0, 1])).toEqual([1]);
    });
    it('filterNegative geeft uitsluitend negatieve getallen terug', async () => {
        expect((await loadFunctions()).filterNegative(example)).toEqual([-4, -4]);
    });
    it('filterEven geeft positieve en negatieve even getallen terug', async () => {
        expect((await loadFunctions()).filterEven(example)).toEqual([-4, -4, 2, 4]);
    });
    it('filter gebruikt de meegegeven predicate voor ieder getal', async () => {
        const predicate = vi.fn((value: number) => value > 2);
        expect((await loadFunctions()).filter([1, 2, 3, 4], predicate)).toEqual([3, 4]);
        expect(predicate).toHaveBeenCalledTimes(4);
    });
    it('filter geeft een nieuwe array terug zonder de invoer te wijzigen', async () => {
        const input = [1, 2, 3];
        const output = (await loadFunctions()).filter(input, () => true);
        expect(output).toEqual(input);
        expect(output).not.toBe(input);
    });
    it('implementeert de algemene filter zelf met een for-lus', () => {
        const source = readFileSync('./index.ts', 'utf8');
        const body = source.match(/function\s+filter\s*\([^)]*\)\s*{([\s\S]*?)\n}/)?.[1] ?? '';
        expect(body).toMatch(/for\s*\(/);
        expect(body).not.toMatch(/\.filter\s*\(/);
    });
    it('hergebruikt de algemene filter in de drie specifieke functies', () => {
        const source = readFileSync('./index.ts', 'utf8');
        for (const name of ['filterPositive', 'filterNegative', 'filterEven']) {
            const body = source.match(new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*{([\\s\\S]*?)\\n}`))?.[1] ?? '';
            expect(body, `${name} moet filter gebruiken`).toMatch(/\bfilter\s*\(/);
        }
    });
});
