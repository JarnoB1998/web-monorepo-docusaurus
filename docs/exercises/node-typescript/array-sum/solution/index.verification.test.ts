import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function loadSum(): Promise<(numbers: number[]) => number> {
    const source = readFileSync('./index.ts', 'utf8').replace(/export\s*{\s*}\s*;?/g, '');
    const directory = mkdtempSync(join(tmpdir(), 'array-sum-verification-'));
    const modulePath = join(directory, 'instrumented.ts');
    try {
        writeFileSync(modulePath, `${source}\nglobalThis.__verificationSum = sum;`);
        await import(pathToFileURL(modulePath).href);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
    return (globalThis as typeof globalThis & { __verificationSum: (numbers: number[]) => number }).__verificationSum;
}

describe('Array sum — verificatie', () => {
    beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));
    afterEach(() => { vi.restoreAllMocks(); delete (globalThis as { __verificationSum?: unknown }).__verificationSum; });

    it('implementeert een functie met de naam sum', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/function\s+sum\s*\(/);
    });
    it('gebruikt een lus om de getallen op te tellen', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/for\s*\(/);
    });
    it('geeft 15 terug voor het opgegeven voorbeeld', async () => { expect((await loadSum())([1, 2, 3, 4, 5])).toBe(15); });
    it('geeft 0 terug voor een lege array', async () => { expect((await loadSum())([])).toBe(0); });
    it('telt negatieve en positieve getallen correct samen', async () => { expect((await loadSum())([-5, 2, 8])).toBe(5); });
    it('wijzigt de meegegeven array niet', async () => {
        const values = [1, 2, 3];
        (await loadSum())(values);
        expect(values).toEqual([1, 2, 3]);
    });
});
