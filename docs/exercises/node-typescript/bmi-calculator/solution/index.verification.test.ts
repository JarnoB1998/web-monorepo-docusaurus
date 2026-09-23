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

async function runProgram(weight: number, height: number) {
    terminal.state.answers = [weight, height];
    terminal.state.prompts = [];
    await import('./index.ts');
    return {
        prompts: terminal.state.prompts,
        output: vi.mocked(console.log).mock.calls.map(([message]) => String(message))
    };
}

describe('BMI Calculator — verificatie', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => vi.restoreAllMocks());

    it('vraagt het gewicht in kilogram', async () => {
        const result = await runProgram(80, 1.8);
        expect(result.prompts[0]).toBe('Geef je gewicht in (in kg): ');
    });

    it('vraagt de lengte in meter', async () => {
        const result = await runProgram(80, 1.8);
        expect(result.prompts[1]).toBe('Geef je lengte in (in m): ');
    });

    it('berekent BMI als gewicht gedeeld door het kwadraat van de lengte', async () => {
        const result = await runProgram(80, 2);
        expect(result.output).toEqual(['Je BMI is 20.00']);
    });

    it('rondt een BMI af op precies twee cijfers na de komma', async () => {
        const result = await runProgram(80, 1.8);
        expect(result.output).toEqual(['Je BMI is 24.69']);
    });

    it('werkt ook met een niet-gehele lengte en een ander gewicht', async () => {
        const result = await runProgram(60, 1.65);
        expect(result.output).toEqual(['Je BMI is 22.04']);
    });
});
