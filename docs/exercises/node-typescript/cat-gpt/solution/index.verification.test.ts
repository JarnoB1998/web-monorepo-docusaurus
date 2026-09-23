import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { repeatWords } from './utils.ts';

const terminal = vi.hoisted(() => ({ answers: [] as string[], question: vi.fn(() => terminal.answers.shift() ?? 'bye') }));
const sloth = vi.hoisted(() => ({ log: vi.fn() }));
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));
vi.mock('sloth-log', () => sloth);

async function runProgram(answers: string[], randomValues: number[]) {
    terminal.answers = [...answers];
    vi.spyOn(Math, 'random').mockImplementation(() => randomValues.shift() ?? 0);
    await import('./index.ts');
}

describe('CatGPT — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); });
    afterEach(() => vi.restoreAllMocks());

    it('repeatWords herhaalt het woord het gevraagde aantal keer', () => expect(repeatWords('Meow', 3, ' ')).toBe('Meow Meow Meow'));
    it('repeatWords plaatst ook een delimiter met meerdere tekens alleen tussen woorden', () => expect(repeatWords('a', 3, '--')).toBe('a--a--a'));
    it('repeatWords geeft bij times 1 alleen het woord terug', () => expect(repeatWords('Meow', 1, '-')).toBe('Meow'));
    it('repeatWords geeft bij times 0 een lege string terug', () => expect(repeatWords('Meow', 0, ' ')).toBe(''));
    it('utils.test.ts bevat afzonderlijke Vitest-tests voor de drie opgegeven gevallen', () => {
        const tests = readFileSync('./utils.test.ts', 'utf8');
        expect(tests).toMatch(/from\s+['"]vitest['"]/);
        expect((tests.match(/test\s*\(/g) ?? [])).toHaveLength(3);
        expect(tests).toMatch(/repeatWords\s*\([^)]*,\s*3\s*,/); expect(tests).toMatch(/repeatWords\s*\([^)]*,\s*1\s*,/);
    });
    it('vraagt invoer met een >-prompt', async () => {
        await runProgram(['bye'], [0, 0]); expect(terminal.question).toHaveBeenCalledWith('> ');
    });
    it('genereert tussen 1 en 10 Meows en print ze via sloth-log', async () => {
        await runProgram(['vraag', 'bye'], [0.999, 0, 0, 0]);
        expect(sloth.log).toHaveBeenNthCalledWith(1, `${'Meow '.repeat(9)}Meow!`, { speed: 1000, maxWordsAtOnce: 2 });
    });
    it.each([['!', 0], ['?', 0.34], ['.', 0.99]] as const)('kan het leesteken %s toevoegen', async (punctuation, random) => {
        await runProgram(['bye'], [0, random]); expect(sloth.log).toHaveBeenCalledWith(`Meow${punctuation}`, expect.any(Object));
    });
    it('stopt na bye en laat de kat nog één laatste antwoord geven', async () => {
        await runProgram(['vraag', 'bye'], [0, 0, 0, 0]);
        expect(terminal.question).toHaveBeenCalledTimes(2); expect(sloth.log).toHaveBeenCalledTimes(2);
    });
});
