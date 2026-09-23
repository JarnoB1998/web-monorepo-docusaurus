import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answers: unknown[]; menus: Array<{ items: string[]; prompt: string; options: unknown }> } = { answers: [], menus: [] };
    const question = vi.fn(() => String(state.answers.shift()));
    const keyInSelect = vi.fn((items: string[], prompt: string, options: unknown) => {
        state.menus.push({ items: [...items], prompt, options });
        return Number(state.answers.shift());
    });
    return { state, question, keyInSelect };
});
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

async function runProgram(...answers: unknown[]) {
    terminal.state.answers = [...answers]; terminal.state.menus = [];
    await import('./index.ts');
    return { menus: terminal.state.menus, output: vi.mocked(console.log).mock.calls.map(([x]) => String(x)) };
}

describe('Todo list met strings — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('toont de vier vereiste menu-opties met keyInSelect', async () => {
        const result = await runProgram(3);
        expect(result.menus[0]).toEqual({
            items: ['Add a task', 'Show tasks', 'Check a task', 'Exit'],
            prompt: 'What do you want to do?', options: { cancel: false }
        });
    });
    it('stopt wanneer Exit wordt gekozen', async () => {
        expect((await runProgram(3)).menus).toHaveLength(1);
    });
    it('vraagt en bewaart een nieuwe taak', async () => {
        await runProgram(0, 'Task 1', 3);
        expect(terminal.question).toHaveBeenCalledWith('Enter a task: ');
    });
    it('toont een niet-afgevinkte taak met een leeg vakje', async () => {
        expect((await runProgram(0, 'Task 1', 1, 3)).output).toContain('1. [ ] Task 1');
    });
    it('toont alle toegevoegde taken in volgorde', async () => {
        const output = (await runProgram(0, 'Task 1', 0, 'Task 2', 1, 3)).output;
        expect(output).toEqual(['1. [ ] Task 1', '2. [ ] Task 2']);
    });
    it('laat alleen niet-afgevinkte taken kiezen bij Check a task', async () => {
        const result = await runProgram(0, 'Task 1', 0, 'Task 2', 2, 1, 3);
        expect(result.menus[3]).toEqual({
            items: ['Task 1', 'Task 2'], prompt: 'What did you do?', options: { cancel: false }
        });
    });
    it('verplaatst een gekozen taak naar de afgevinkte taken', async () => {
        const output = (await runProgram(0, 'Task 1', 0, 'Task 2', 2, 1, 1, 3)).output;
        expect(output).toContain('1. [ ] Task 1');
        expect(output).toContain('2. [X] Task 2');
        expect(output).not.toContain('2. [ ] Task 2');
    });
    it('toont afgevinkte taken met een X', async () => {
        const output = (await runProgram(0, 'Task 1', 2, 0, 1, 3)).output;
        expect(output).toContain('1. [X] Task 1');
    });
});
