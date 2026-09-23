import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answers: unknown[]; prompts: string[] } = { answers: [], prompts: [] };
    const question = vi.fn((prompt: string) => { state.prompts.push(prompt); return String(state.answers.shift()); });
    return { state, question };
});
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

async function runProgram(...answers: unknown[]) {
    terminal.state.answers = [...answers]; terminal.state.prompts = [];
    await import('./index.ts');
    return { prompts: terminal.state.prompts, output: vi.mocked(console.log).mock.calls.map(([x]) => String(x)) };
}

describe('Pokemon team — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('toont alle 21 Pokémon met hun index van 0 tot en met 20', async () => {
        const list = (await runProgram('STOP')).output.slice(0, 21);
        expect(list).toHaveLength(21);
        expect(list[0]).toBe('0. Bulbasaur');
        expect(list[20]).toBe('20. Spearow');
    });
    it('vraagt herhaaldelijk een index tussen 0 en 20', async () => {
        const result = await runProgram('4', 'STOP');
        expect(result.prompts).toEqual([
            'Welke pokemon wil je in je team? [0-20]: ',
            'Welke pokemon wil je in je team? [0-20]: '
        ]);
    });
    it('aanvaardt STOP zonder onderscheid tussen hoofd- en kleine letters', async () => {
        expect((await runProgram('stop')).prompts).toHaveLength(1);
    });
    it('voegt de Pokémon van de gekozen index toe aan het team', async () => {
        expect((await runProgram('4', 'STOP')).output).toContain('1. Charmeleon');
    });
    it('nummer het uiteindelijke team vanaf 1', async () => {
        const output = (await runProgram('1', '2', 'STOP')).output;
        expect(output.slice(-3)).toEqual(['Jouw team van pokemon is: ', '1. Ivysaur', '2. Venusaur']);
    });
    it('weigert een Pokémon die al in het team zit', async () => {
        const output = (await runProgram('4', '4', 'STOP')).output;
        expect(output).toContain('Deze pokemon zit al in je team');
        expect(output.filter((line) => line.endsWith('Charmeleon'))).toHaveLength(2);
    });
    it('weigert een index groter dan de Pokémonlijst', async () => {
        expect((await runProgram('21', 'STOP')).output).toContain('Deze pokemon ken ik niet');
    });
    it('weigert een negatieve index', async () => {
        expect((await runProgram('-1', 'STOP')).output).toContain('Deze pokemon ken ik niet');
    });
});
