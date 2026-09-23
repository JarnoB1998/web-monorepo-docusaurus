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

async function runProgram(amount: number) {
    terminal.state.answers = [amount];
    terminal.state.prompts = [];
    await import('./index.ts');
    return {
        prompts: terminal.state.prompts,
        output: vi.mocked(console.log).mock.calls.map(([message]) => String(message))
    };
}

describe('Wisselgeld — verificatie', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => vi.restoreAllMocks());

    it('vraagt het bedrag', async () => {
        const result = await runProgram(123);
        expect(result.prompts).toEqual(['Geef het bedrag in: ']);
    });

    it.each([
        [500, 'Dit is 1 briefje van 500'],
        [200, 'Dit is 1 briefje van 200'],
        [100, 'Dit is 1 briefje van 100'],
        [50, 'Dit is 1 briefje van 50'],
        [20, 'Dit is 1 briefje van 20'],
        [10, 'Dit is 1 munt van 10'],
        [5, 'Dit is 1 munt van 5'],
        [2, 'Dit is 1 munt van 2'],
        [1, 'Dit is 1 munt van 1']
    ])('ondersteunt de denominatie van %i', async (amount, expected) => {
        const result = await runProgram(amount);
        expect(result.output).toEqual([expected]);
    });

    it('gebruikt telkens de grootste mogelijke denominatie', async () => {
        const result = await runProgram(987);
        expect(result.output).toEqual([
            'Dit is 1 briefje van 500, 2 briefjes van 200, 1 briefje van 50, 1 briefje van 20, 1 munt van 10, 1 munt van 5 en 1 munt van 2'
        ]);
    });

    it('gebruikt de juiste meervoudsvorm voor meerdere briefjes', async () => {
        const result = await runProgram(400);
        expect(result.output).toEqual(['Dit is 2 briefjes van 200']);
    });

    it('gebruikt de juiste meervoudsvorm voor meerdere munten', async () => {
        const result = await runProgram(19);
        expect(result.output).toEqual(['Dit is 1 munt van 10, 1 munt van 5 en 2 munten van 2']);
    });

    it('scheidt het laatste onderdeel van een opsomming met "en"', async () => {
        const result = await runProgram(123);
        expect(result.output).toEqual([
            'Dit is 1 briefje van 100, 1 briefje van 20, 1 munt van 2 en 1 munt van 1'
        ]);
    });
});
