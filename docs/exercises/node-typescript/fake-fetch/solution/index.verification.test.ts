import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type GetRandom = () => Promise<number>;

async function loadFunction(): Promise<GetRandom> {
    const source = readFileSync('./index.ts', 'utf8');
    const definition = source.slice(0, source.indexOf('getRandom().then'));
    const directory = mkdtempSync(join(tmpdir(), 'fake-fetch-verification-'));
    const modulePath = join(directory, 'instrumented.ts');
    try {
        writeFileSync(modulePath, `${definition}\nglobalThis.__getRandom = getRandom;`);
        await import(pathToFileURL(modulePath).href);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
    return (globalThis as typeof globalThis & { __getRandom: GetRandom }).__getRandom;
}

describe('Fake Fetch — verificatie', () => {
    beforeEach(() => { vi.useFakeTimers(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => {
        vi.useRealTimers(); vi.restoreAllMocks(); vi.resetModules();
        delete (globalThis as { __getRandom?: GetRandom }).__getRandom;
    });

    it('getRandom geeft een Promise terug', async () => { expect((await loadFunction())()).toBeInstanceOf(Promise); });
    it('wacht 1000 ms voordat het resultaat beschikbaar is', async () => {
        const promise = (await loadFunction())();
        let settled = false; promise.finally(() => { settled = true; });
        await vi.advanceTimersByTimeAsync(999); expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1); await promise; expect(settled).toBe(true);
    });
    it('kan de ondergrens 0 genereren', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        const promise = (await loadFunction())(); await vi.runAllTimersAsync(); await expect(promise).resolves.toBe(0);
    });
    it('kan de bovengrens 99 genereren', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999);
        const promise = (await loadFunction())(); await vi.runAllTimersAsync(); await expect(promise).resolves.toBe(99);
    });
    it('toont een resultaat via promise chaining', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.42);
        await import('./index.ts'); await vi.runAllTimersAsync();
        expect(console.log).toHaveBeenCalledWith('The number was 42');
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/\.then\s*\(/);
    });
    it('toont ook een resultaat via async/await', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.17);
        await import('./index.ts'); await vi.runAllTimersAsync();
        expect(vi.mocked(console.log).mock.calls.filter(([value]) => value === 'The number was 17')).toHaveLength(2);
        const source = readFileSync('./index.ts', 'utf8');
        expect(source).toMatch(/async\s*\(/); expect(source).toMatch(/await\s+/);
    });
});
