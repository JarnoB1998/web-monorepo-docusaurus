import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answers: unknown[]; prompts: string[] } = { answers: [], prompts: [] };
    const next = (prompt: string): unknown => {
        state.prompts.push(prompt);
        return state.answers.shift();
    };
    return {
        state,
        question: vi.fn((prompt: string) => String(next(prompt))),
        questionInt: vi.fn((prompt: string) => Number(next(prompt))),
        questionFloat: vi.fn((prompt: string) => Number(next(prompt)))
    };
});

vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

async function runProgram(amount: number, interest: number) {
    terminal.state.answers = [amount, interest];
    terminal.state.prompts = [];
    await import('./index.ts');
    return {
        prompts: terminal.state.prompts,
        output: vi.mocked(console.log).mock.calls.map(([message]) => String(message))
    };
}

describe('Interest Calculator — verificatie', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => vi.restoreAllMocks());

    it('vraagt het startbedrag', async () => {
        const result = await runProgram(1000, 5);
        expect(result.prompts[0]).toBe('Geef het bedrag in: ');
    });

    it('vraagt het interestpercentage', async () => {
        const result = await runProgram(1000, 5);
        expect(result.prompts[1]).toBe('Geef het interest percentage in: ');
    });

    it('berekent het totaal na één jaar', async () => {
        const result = await runProgram(1000, 5);
        expect(result.output[0]).toBe('Na 1 jaar heb je 1050');
    });

    it('berekent samengestelde interest na twee jaar', async () => {
        const result = await runProgram(1000, 5);
        expect(result.output[1]).toBe('Na 2 jaar heb je 1102.5');
    });

    it('berekent samengestelde interest na vijf jaar', async () => {
        const result = await runProgram(1000, 5);
        expect(result.output[2]).toBe('Na 5 jaar heb je 1276.28');
    });

    it('toont uitsluitend de resultaten voor 1, 2 en 5 jaar', async () => {
        const result = await runProgram(1000, 5);
        expect(result.output).toHaveLength(3);
    });
});
