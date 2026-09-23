import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type TestFunction = (value: number) => boolean;
type Functions = {
    isOdd: TestFunction; isEven: TestFunction; isPositive: TestFunction; isFibonacci: TestFunction;
    atLeastTwo(values: number[], predicate: TestFunction): boolean;
};

async function loadFunctions(): Promise<Functions> {
    const source = readFileSync('./index.ts', 'utf8').replace(/export\s*{\s*}\s*;?/g, '');
    const directory = mkdtempSync(join(tmpdir(), 'at-least-two-verification-'));
    const modulePath = join(directory, 'instrumented.ts');
    try {
        writeFileSync(modulePath, `${source}\nglobalThis.__verificationFunctions = { isOdd, isEven, isPositive, isFibonacci, atLeastTwo };`);
        await import(pathToFileURL(modulePath).href);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
    return (globalThis as typeof globalThis & { __verificationFunctions: Functions }).__verificationFunctions;
}

describe('At Least Two — verificatie', () => {
    beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));
    afterEach(() => { vi.restoreAllMocks(); delete (globalThis as { __verificationFunctions?: Functions }).__verificationFunctions; });

    it('definieert de interface TestFunction', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/interface\s+TestFunction\s*{[\s\S]*\(\s*n\s*:\s*number\s*\)\s*:\s*boolean/);
    });
    it('isOdd herkent uitsluitend oneven getallen', async () => {
        const { isOdd } = await loadFunctions(); expect(isOdd(3)).toBe(true); expect(isOdd(4)).toBe(false);
    });
    it('isEven herkent uitsluitend even getallen', async () => {
        const { isEven } = await loadFunctions(); expect(isEven(4)).toBe(true); expect(isEven(3)).toBe(false);
    });
    it('bevat twee bijkomende functies van hetzelfde functietype', async () => {
        const { isPositive, isFibonacci } = await loadFunctions();
        expect(typeof isPositive).toBe('function'); expect(typeof isFibonacci).toBe('function');
    });
    it('geeft false terug als minder dan twee elementen voldoen', async () => {
        const { atLeastTwo, isOdd } = await loadFunctions();
        expect(atLeastTwo([2, 3, 4, 6, 8], isOdd)).toBe(false);
    });
    it('geeft true terug als exact twee elementen voldoen', async () => {
        const { atLeastTwo, isOdd } = await loadFunctions();
        expect(atLeastTwo([2, 3, 4, 5, 6, 8], isOdd)).toBe(true);
    });
    it('geeft true terug als meer dan twee elementen voldoen', async () => {
        const { atLeastTwo, isEven } = await loadFunctions();
        expect(atLeastTwo([2, 4, 6], isEven)).toBe(true);
    });
    it('roept de meegegeven testfunctie aan', async () => {
        const predicate = vi.fn((value: number) => value > 0);
        (await loadFunctions()).atLeastTwo([-1, 1, 2], predicate);
        expect(predicate).toHaveBeenCalled();
    });
});
