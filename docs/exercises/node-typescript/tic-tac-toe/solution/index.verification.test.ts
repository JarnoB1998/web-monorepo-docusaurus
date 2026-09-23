import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answers: string[]; prompts: string[] } = { answers: [], prompts: [] };
    const question = vi.fn((prompt: string) => { state.prompts.push(prompt); return state.answers.shift() ?? ''; });
    return { state, question };
});
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

async function play(...moves: string[]) {
    terminal.state.answers = [...moves]; terminal.state.prompts = [];
    await import('./index.ts');
    return { prompts: terminal.state.prompts, output: vi.mocked(console.log).mock.calls.map(([x]) => String(x)) };
}

const xWinsTopRow = ['0,0', '1,0', '0,1', '1,1', '0,2'];

describe('Tic Tac Toe — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('toont een leeg bord van drie bij drie met coördinaten', async () => {
        const output = (await play(...xWinsTopRow)).output;
        expect(output.slice(0, 6)).toEqual(['  0 1 2', '0  | | ', '  -----', '1  | | ', '  -----', '2  | | ']);
    });
    it('laat speler X beginnen', async () => {
        expect((await play(...xWinsTopRow)).prompts[0]).toBe('Player X, enter your move (row,col): ');
    });
    it('wisselt na een geldige zet van X naar O', async () => {
        expect((await play(...xWinsTopRow)).prompts[1]).toBe('Player O, enter your move (row,col): ');
    });
    it('plaatst een geldige zet op het bord', async () => {
        const output = (await play(...xWinsTopRow)).output;
        expect(output).toContain('0 X| | ');
    });
    it('weigert een coördinaat buiten het bord en laat dezelfde speler opnieuw proberen', async () => {
        const result = await play('3,0', ...xWinsTopRow);
        expect(result.output).toContain('Invalid move, please try again.');
        expect(result.prompts[0]).toBe('Player X, enter your move (row,col): ');
        expect(result.prompts[1]).toBe('Player X, enter your move (row,col): ');
    });
    it('weigert een reeds bezette plaats en laat dezelfde speler opnieuw proberen', async () => {
        const result = await play('0,0', '0,0', '1,0', '0,1', '1,1', '0,2');
        expect(result.output).toContain('That spot is already taken, please choose another.');
        expect(result.prompts[1]).toBe('Player O, enter your move (row,col): ');
        expect(result.prompts[2]).toBe('Player O, enter your move (row,col): ');
    });
    it('herkent winst op een rij', async () => {
        expect((await play(...xWinsTopRow)).output.at(-1)).toBe('Player X wins!');
    });
    it('herkent winst op een kolom', async () => {
        expect((await play('0,0', '0,1', '1,0', '1,1', '2,0')).output.at(-1)).toBe('Player X wins!');
    });
    it('herkent winst op een diagonaal', async () => {
        expect((await play('0,0', '0,1', '1,1', '0,2', '2,2')).output.at(-1)).toBe('Player X wins!');
    });
    it('herkent een vol bord zonder winnaar als gelijkspel', async () => {
        const moves = ['0,0', '0,1', '0,2', '1,1', '1,0', '1,2', '2,1', '2,0', '2,2'];
        expect((await play(...moves)).output.at(-1)).toBe("It's a draw!");
    });
});
