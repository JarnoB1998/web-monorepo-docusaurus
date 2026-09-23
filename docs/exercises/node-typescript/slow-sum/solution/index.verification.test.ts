import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type SlowFunctions = {
    slowSum(a: number, b: number): Promise<number>;
    slowMult(a: number, b: number): Promise<number>;
    slowDiv(a: number, b: number): Promise<number>;
};

async function loadFunctions(): Promise<SlowFunctions> {
    const source = readFileSync('./index.ts', 'utf8');
    const definitions = source.slice(0, source.indexOf('slowSum(1, 5)'));
    const directory = mkdtempSync(join(tmpdir(), 'slow-sum-verification-'));
    const modulePath = join(directory, 'instrumented.ts');
    try {
        writeFileSync(modulePath, `${definitions}\nglobalThis.__slowFunctions = { slowSum, slowMult, slowDiv };`);
        await import(pathToFileURL(modulePath).href);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
    return (globalThis as typeof globalThis & { __slowFunctions: SlowFunctions }).__slowFunctions;
}

describe('Slow Sum — verificatie', () => {
    beforeEach(() => { vi.useFakeTimers(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => {
        vi.useRealTimers(); vi.restoreAllMocks(); vi.resetModules();
        delete (globalThis as { __slowFunctions?: SlowFunctions }).__slowFunctions;
    });

    it('slowSum geeft een Promise terug', async () => {
        expect((await loadFunctions()).slowSum(1, 5)).toBeInstanceOf(Promise);
    });
    it('slowSum telt de getallen op na 1000 ms', async () => {
        const promise = (await loadFunctions()).slowSum(1, 5);
        await vi.advanceTimersByTimeAsync(999);
        let settled = false; promise.finally(() => { settled = true; });
        await Promise.resolve(); expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1); await expect(promise).resolves.toBe(6);
    });
    it('slowMult vermenigvuldigt de getallen na 1500 ms', async () => {
        const promise = (await loadFunctions()).slowMult(6, 2);
        await vi.advanceTimersByTimeAsync(1499);
        let settled = false; promise.finally(() => { settled = true; });
        await Promise.resolve(); expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1); await expect(promise).resolves.toBe(12);
    });
    it('slowDiv deelt de getallen na 2000 ms', async () => {
        const promise = (await loadFunctions()).slowDiv(6, 3);
        await vi.advanceTimersByTimeAsync(1999);
        let settled = false; promise.finally(() => { settled = true; });
        await Promise.resolve(); expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1); await expect(promise).resolves.toBe(2);
    });
    it('slowDiv weigert een deling door nul met de gevraagde foutmelding', async () => {
        await expect((await loadFunctions()).slowDiv(6, 0)).rejects.toBe('You cannot divide by zero');
    });
    it('index.ts gebruikt promise chaining en toont alle gevraagde resultaten', async () => {
        await import('./index.ts');
        await vi.runAllTimersAsync();
        const output = vi.mocked(console.log).mock.calls.map(([value]) => String(value));
        expect(output).toEqual(expect.arrayContaining(['You cannot divide by zero', '1 + 5 = 6', '(6 / 3) = 2', '(1 + 5) * 2 = 12']));
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/\.then\s*\(/);
    });
    it('index_async.ts gebruikt async/await en toont alle gevraagde resultaten', async () => {
        await import('./index_async.ts');
        await vi.runAllTimersAsync();
        const output = vi.mocked(console.log).mock.calls.map(([value]) => String(value));
        expect(output).toEqual(expect.arrayContaining(['You cannot divide by zero', '1 + 5 = 6', '(6 / 3) = 2', '(1 + 5) * 2 = 12']));
        const source = readFileSync('./index_async.ts', 'utf8');
        expect(source).toMatch(/async\s*\(/); expect(source).toMatch(/await\s+/);
    });
});
