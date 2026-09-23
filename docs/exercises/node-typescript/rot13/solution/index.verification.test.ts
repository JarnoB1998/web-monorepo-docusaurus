import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answers: unknown[]; prompts: string[] } = { answers: [], prompts: [] };
    const question = vi.fn((prompt: string) => { state.prompts.push(prompt); return String(state.answers.shift()); });
    return { state, question };
});
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

async function encode(text: string) {
    terminal.state.answers = [text]; terminal.state.prompts = [];
    await import('./index.ts');
    return { prompts: terminal.state.prompts, output: String(vi.mocked(console.log).mock.calls[0]?.[0]) };
}

describe('Rot13 — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('vraagt om een tekst', async () => { expect((await encode('hello')).prompts).toEqual(['Enter a string: ']); });
    it('verschuift iedere kleine letter dertien plaatsen', async () => { expect((await encode('hello')).output).toBe('uryyb'); });
    it('gaat na z terug naar het begin van het alfabet', async () => { expect((await encode('nopqrstuvwxyz')).output).toBe('abcdefghijklm'); });
    it('behoudt hoofdletters', async () => { expect((await encode('Hello WORLD')).output).toBe('Uryyb JBEYQ'); });
    it('laat spaties en leestekens ongewijzigd', async () => { expect((await encode('hello, world!')).output).toBe('uryyb, jbeyq!'); });
    it('laat cijfers ongewijzigd', async () => { expect((await encode('abc123')).output).toBe('nop123'); });
    it('kan een gecodeerde tekst opnieuw decoderen', async () => { expect((await encode('uryyb')).output).toBe('hello'); });
});
