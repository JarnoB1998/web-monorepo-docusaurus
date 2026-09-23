import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answers: unknown[]; prompts: string[] } = { answers: [], prompts: [] };
    const next = (prompt: string): unknown => { state.prompts.push(prompt); return state.answers.shift(); };
    return { state, question: vi.fn((prompt: string) => String(next(prompt))) };
});
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

async function runProgram(...answers: unknown[]) {
    terminal.state.answers = [...answers]; terminal.state.prompts = [];
    await import('./index.ts');
    return { prompts: terminal.state.prompts, output: vi.mocked(console.log).mock.calls.map(([x]) => String(x)) };
}

describe('Puntenboek — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('bewaart de punten in een getal-array', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/:\s*number\[\]\s*=/);
    });
    it('nummer de vragen per student vanaf 1', async () => {
        expect((await runProgram('5', '6', '')).prompts).toEqual([
            'Geef de punten van student 1 in: ',
            'Geef de punten van student 2 in: ',
            'Geef de punten van student 3 in: '
        ]);
    });
    it('blijft punten vragen totdat een lege tekst wordt ingegeven', async () => {
        expect((await runProgram('5', '6', '10', '')).prompts).toHaveLength(4);
    });
    it('berekent het gemiddelde van alle punten', async () => {
        expect((await runProgram('5', '6', '10', '')).output[0]).toBe('Het gemiddelde van de punten is 7');
    });
    it('rondt een niet-geheel gemiddelde af', async () => {
        expect((await runProgram('10', '11', '')).output[0]).toBe('Het gemiddelde van de punten is 11');
    });
    it('telt punten lager dan 10 als onvoldoende', async () => {
        expect((await runProgram('5', '6', '10', '')).output[1]).toBe('Het aantal studenten met een onvoldoende is 2');
    });
    it('telt 10 punten niet als onvoldoende', async () => {
        expect((await runProgram('9', '10', '20', '')).output[1]).toBe('Het aantal studenten met een onvoldoende is 1');
    });
});
