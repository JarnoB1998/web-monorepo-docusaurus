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
        questionFloat: vi.fn((prompt: string) => Number(next(prompt))),
        keyInYNStrict: vi.fn((prompt: string) => Boolean(next(prompt)))
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

describe('Name from email — verificatie', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => vi.restoreAllMocks());

    it('vraagt naar een e-mailadres', async () => {
        const result = await runProgram('andie.similon@ap.be', false);
        expect(result.prompts[0]).toBe('Geef het email adres in: ');
    });

    it('neemt de eerste letter van de voornaam en zet die in hoofdletter', async () => {
        const result = await runProgram('andie.similon@ap.be', false);
        expect(result.output[0]).toBe('De naam is A. Similon');
    });

    it('neemt de achternaam tussen de punt en het apenstaartje', async () => {
        const result = await runProgram('sven.maes@ap.be', false);
        expect(result.output[0]).toBe('De naam is S. Maes');
    });

    it('vraagt met keyInYNStrict of nog een adres ingegeven wordt', async () => {
        await runProgram('andie.similon@ap.be', false);
        expect(terminal.keyInYNStrict).toHaveBeenCalledWith('Wil je nog een email adres ingeven?');
    });

    it('vraagt een volgend e-mailadres na een bevestigend antwoord', async () => {
        const result = await runProgram(
            'andie.similon@ap.be', true,
            'sven.maes@ap.be', false
        );
        expect(result.prompts.filter((prompt) => prompt === 'Geef het email adres in: ')).toHaveLength(2);
    });

    it('toont de naam voor ieder ingegeven e-mailadres', async () => {
        const result = await runProgram(
            'andie.similon@ap.be', true,
            'sven.maes@ap.be', false
        );
        expect(result.output.slice(0, 2)).toEqual([
            'De naam is A. Similon',
            'De naam is S. Maes'
        ]);
    });

    it('sluit af met de afscheidsboodschap na een negatief antwoord', async () => {
        const result = await runProgram('andie.similon@ap.be', false);
        expect(result.output.at(-1)).toBe('Nog een goede dag!');
    });
});
