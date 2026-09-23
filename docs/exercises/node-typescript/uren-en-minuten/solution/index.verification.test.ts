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

async function runProgram(minutes: number) {
    terminal.state.answers = [minutes];
    terminal.state.prompts = [];
    await import('./index.ts');
    return {
        prompts: terminal.state.prompts,
        output: vi.mocked(console.log).mock.calls.map(([message]) => String(message))
    };
}

describe('Uren en minuten — verificatie', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => vi.restoreAllMocks());

    it('vraagt het aantal minuten', async () => {
        const result = await runProgram(150);
        expect(result.prompts).toEqual(['Geef het aantal minuten in: ']);
    });

    it('berekent het aantal volledige uren', async () => {
        const result = await runProgram(150);
        expect(result.output).toEqual(['Dit is 2 uur en 30 minuten']);
    });

    it('behoudt de resterende minuten met de modulo-berekening', async () => {
        const result = await runProgram(179);
        expect(result.output).toEqual(['Dit is 2 uur en 59 minuten']);
    });

    it('werkt voor een invoer kleiner dan één uur', async () => {
        const result = await runProgram(59);
        expect(result.output).toEqual(['Dit is 0 uur en 59 minuten']);
    });

    it('toont nul resterende minuten bij een exact aantal uren', async () => {
        const result = await runProgram(120);
        expect(result.output).toEqual(['Dit is 2 uur en 0 minuten']);
    });
});
