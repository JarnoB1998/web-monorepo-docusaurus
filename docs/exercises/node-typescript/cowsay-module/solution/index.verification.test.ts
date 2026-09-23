import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => ({ answers: [] as string[], question: vi.fn(() => terminal.answers.shift() ?? 'exit') }));
const cow = vi.hoisted(() => ({ say: vi.fn(({ text }: { text: string }) => `cow says ${text}`) }));
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));
vi.mock('cowsay', () => cow);

async function runProgram(answers: string[]) {
    terminal.answers = [...answers];
    await import('./index.ts');
    return vi.mocked(console.log).mock.calls.map(([value]) => String(value));
}

describe('Cowsay Module — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('vraagt met de opgegeven prompt wat de koe moet zeggen', async () => {
        await runProgram(['exit']); expect(terminal.question).toHaveBeenCalledWith('What should the cow say? ');
    });
    it('geeft normale tekst door aan cowsay.say', async () => {
        await runProgram(['Moo!', 'exit']); expect(cow.say).toHaveBeenCalledWith({ text: 'Moo!' });
    });
    it('toont de door cowsay gemaakte uitvoer', async () => {
        expect(await runProgram(['Moo!', 'exit'])).toContain('cow says Moo!');
    });
    it('weigert Meow! met de gevraagde foutmelding', async () => {
        expect(await runProgram(['Meow!', 'exit'])).toContain("Cows don't meow!");
        expect(cow.say).not.toHaveBeenCalledWith({ text: 'Meow!' });
    });
    it('blijft invoer vragen na een ongeldige boodschap', async () => {
        await runProgram(['Meow!', 'Moo!', 'exit']); expect(terminal.question).toHaveBeenCalledTimes(3);
    });
    it('stopt bij exit zonder exit door cowsay te laten verwerken', async () => {
        await runProgram(['exit']); expect(cow.say).not.toHaveBeenCalled();
    });
});
