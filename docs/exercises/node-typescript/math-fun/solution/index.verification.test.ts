import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type MathFunctions = {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
    multiply(a: number, b?: number): number;
    divide(a: number, b?: number): number;
};

async function loadFunctions(): Promise<MathFunctions> {
    const source = readFileSync('./index.ts', 'utf8').replace(/export\s*{\s*}\s*;?/g, '');
    const instrumented = `${source}\nglobalThis.__verificationFunctions = { add, subtract, multiply, divide };`;
    const directory = mkdtempSync(join(tmpdir(), 'math-fun-verification-'));
    const modulePath = join(directory, 'instrumented.ts');
    try {
        writeFileSync(modulePath, instrumented);
        await import(pathToFileURL(modulePath).href);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
    return (globalThis as typeof globalThis & { __verificationFunctions: MathFunctions }).__verificationFunctions;
}

describe('Wiskundige functies — verificatie', () => {
    beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));
    afterEach(() => { vi.restoreAllMocks(); delete (globalThis as { __verificationFunctions?: MathFunctions }).__verificationFunctions; });

    it('add telt twee getallen op', async () => { expect((await loadFunctions()).add(4, 5)).toBe(9); });
    it('subtract trekt het tweede getal van het eerste af', async () => { expect((await loadFunctions()).subtract(6, 3)).toBe(3); });
    it('multiply vermenigvuldigt twee getallen', async () => { expect((await loadFunctions()).multiply(4, 5)).toBe(20); });
    it('multiply gebruikt standaard 1 voor de tweede parameter', async () => { expect((await loadFunctions()).multiply(7)).toBe(7); });
    it('divide deelt het eerste getal door het tweede', async () => { expect((await loadFunctions()).divide(8, 2)).toBe(4); });
    it('divide gebruikt standaard 1 voor de tweede parameter', async () => { expect((await loadFunctions()).divide(7)).toBe(7); });
    it('combineert de functies voor de opgegeven berekening', async () => {
        const { add, subtract, multiply, divide } = await loadFunctions();
        expect(divide(multiply(add(4, 5), subtract(6, 3)), 2)).toBe(13.5);
    });
    it('print het resultaat 13.5', async () => {
        await loadFunctions();
        expect(console.log).toHaveBeenCalledWith(13.5);
    });
});
