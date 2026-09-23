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

describe('Text-box — verificatie', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => vi.restoreAllMocks());

    it('vraagt de gebruiker om tekst', async () => {
        const result = await runProgram('Hello World', '');
        expect(result.prompts[0]).toBe('Geef de tekst in: ');
    });

    it('plaatst de tekst tussen verticale randen met spaties', async () => {
        const result = await runProgram('Hello World', '');
        expect(result.output[1]).toBe('| Hello World |');
    });

    it('maakt de bovenrand twee tekens langer dan de tekst', async () => {
        const result = await runProgram('Hello World', '');
        expect(result.output[0]).toBe('+-------------+');
    });

    it('maakt de onderrand gelijk aan de bovenrand', async () => {
        const result = await runProgram('Hello World', '');
        expect(result.output[2]).toBe(result.output[0]);
    });

    it('past de breedte van het kader aan de lengte van iedere tekst aan', async () => {
        const result = await runProgram('Hey broer', '');
        expect(result.output.slice(0, 3)).toEqual([
            '+-----------+',
            '| Hey broer |',
            '+-----------+'
        ]);
    });

    it('blijft teksten vragen en tekent voor elke niet-lege tekst een kader', async () => {
        const result = await runProgram('Hello World', 'Hey broer', '');
        expect(result.prompts).toHaveLength(3);
        expect(result.output.slice(0, 6)).toEqual([
            '+-------------+',
            '| Hello World |',
            '+-------------+',
            '+-----------+',
            '| Hey broer |',
            '+-----------+'
        ]);
    });

    it('stopt bij een lege tekst en neemt afscheid', async () => {
        const result = await runProgram('');
        expect(result.prompts).toHaveLength(1);
        expect(result.output).toEqual(['Tot ziens!']);
    });
});
