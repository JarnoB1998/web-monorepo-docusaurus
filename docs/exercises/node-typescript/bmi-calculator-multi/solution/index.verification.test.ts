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

async function runProgram(...answers: unknown[]) {
    terminal.state.answers = [...answers];
    terminal.state.prompts = [];
    await import('./index.ts');
    return {
        prompts: terminal.state.prompts,
        output: vi.mocked(console.log).mock.calls.map(([message]) => String(message))
    };
}

describe('BMI Calculator voor meerdere personen — verificatie', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => vi.restoreAllMocks());

    it('vraagt eerst hoeveel personen ingegeven worden', async () => {
        const result = await runProgram(1, 'Jan', 80, 1.8);
        expect(result.prompts[0]).toBe('Geef het aantal personen in: ');
    });

    it('nummer de vraag naar iedere persoon vanaf 1', async () => {
        const result = await runProgram(2, 'Jan', 80, 1.8, 'Piet', 90, 1.75);
        expect(result.prompts).toContain('Geef de naam van persoon 1 in: ');
        expect(result.prompts).toContain('Geef de naam van persoon 2 in: ');
    });

    it('vermeldt de naam in de vraag naar het gewicht', async () => {
        const result = await runProgram(1, 'Jan', 80, 1.8);
        expect(result.prompts).toContain('Geef het gewicht van Jan in (in kg): ');
    });

    it('vermeldt de naam in de vraag naar de lengte', async () => {
        const result = await runProgram(1, 'Jan', 80, 1.8);
        expect(result.prompts).toContain('Geef de lengte van Jan in (in m): ');
    });

    it('berekent en toont de BMI met twee cijfers na de komma', async () => {
        const result = await runProgram(1, 'Jan', 80, 1.8);
        expect(result.output).toEqual(['Jan heeft een BMI van 24.69']);
    });

    it('verwerkt exact het gevraagde aantal personen', async () => {
        const result = await runProgram(2, 'Jan', 80, 1.8, 'Piet', 90, 1.75);
        expect(result.output).toEqual([
            'Jan heeft een BMI van 24.69',
            'Piet heeft een BMI van 29.39'
        ]);
    });
});
