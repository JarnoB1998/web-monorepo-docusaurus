import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answers: unknown[]; prompts: string[] } = { answers: [], prompts: [] };
    const next = (prompt: string): unknown => { state.prompts.push(prompt); return state.answers.shift(); };
    return {
        state,
        question: vi.fn((prompt: string) => String(next(prompt))),
        questionInt: vi.fn((prompt: string) => Number(next(prompt))),
        questionFloat: vi.fn((prompt: string) => Number(next(prompt)))
    };
});
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

async function runProgram(...answers: unknown[]) {
    terminal.state.answers = [...answers]; terminal.state.prompts = [];
    await import('./index.ts');
    return { prompts: terminal.state.prompts, output: vi.mocked(console.log).mock.calls.map(([x]) => String(x)) };
}

describe('Som van getallen — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('bewaart de ingegeven getallen in een getal-array', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/:\s*number\[\]\s*=/);
    });
    it('vraagt eerst hoeveel getallen opgeteld worden', async () => {
        expect((await runProgram(1, 5)).prompts[0]).toBe('Hoeveel getallen wil je optellen? ');
    });
    it('nummer elke vraag naar een getal vanaf 1', async () => {
        expect((await runProgram(3, 5, 3, 7)).prompts.slice(1)).toEqual([
            'Geef getal 1 in: ', 'Geef getal 2 in: ', 'Geef getal 3 in: '
        ]);
    });
    it('vraagt exact het opgegeven aantal getallen', async () => {
        expect((await runProgram(2, 10, 20)).prompts).toHaveLength(3);
    });
    it('telt alle ingegeven getallen op', async () => {
        expect((await runProgram(3, 5, 3, 7)).output).toEqual(['De som van de getallen is 15']);
    });
    it('verwerkt ook negatieve getallen en nul', async () => {
        expect((await runProgram(4, -5, 0, 3, 7)).output).toEqual(['De som van de getallen is 5']);
    });
});
