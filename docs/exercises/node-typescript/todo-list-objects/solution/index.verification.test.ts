import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answers: unknown[]; menus: Array<{ items: string[]; prompt: string }> } = { answers: [], menus: [] };
    const question = vi.fn(() => String(state.answers.shift()));
    const keyInSelect = vi.fn((items: string[], prompt: string) => {
        state.menus.push({ items: [...items], prompt }); return Number(state.answers.shift());
    });
    return { state, question, keyInSelect };
});
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

async function runProgram(...answers: unknown[]) {
    terminal.state.answers = [...answers]; terminal.state.menus = [];
    await import('./index.ts');
    return { menus: terminal.state.menus, output: vi.mocked(console.log).mock.calls.map(([x]) => String(x)) };
}

describe('Todo list met objecten — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => vi.restoreAllMocks());

    it('definieert Todo met id, title en completed van de juiste types', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/interface\s+Todo\s*{[\s\S]*id\s*:\s*number[\s\S]*title\s*:\s*string[\s\S]*completed\s*:\s*boolean/);
    });
    it('importeert de begintaken uit todos.json', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/import\s+\w+\s+from\s+['"]\.\/todos\.json['"]/);
    });
    it('toont de geladen taken met hun id en status', async () => {
        const output = (await runProgram(1, 3)).output;
        expect(output).toContain('1. [ ] gras afrijden');
        expect(output).toContain('4. [X] typescript oefenen');
    });
    it('gebruikt één array met Todo-objecten', () => {
        const source = readFileSync('./index.ts', 'utf8');
        expect(source).toMatch(/:\s*Todo\[\]\s*=/);
    });
    it('voegt een taak toe met een uniek volgend id en completed false', async () => {
        const output = (await runProgram(0, 'nieuwe taak', 1, 3)).output;
        expect(output).toContain('10. [ ] nieuwe taak');
    });
    it('laat alleen onafgewerkte taken kiezen om af te vinken', async () => {
        const result = await runProgram(2, 0, 3);
        const checkMenu = result.menus[1];
        expect(checkMenu.items).not.toContain('typescript oefenen');
        expect(checkMenu.items).not.toContain('boodschappen doen');
        expect(checkMenu.items).toContain('gras afrijden');
    });
    it('wijzigt completed naar true voor de gekozen taak', async () => {
        const output = (await runProgram(2, 0, 1, 3)).output;
        expect(output).toContain('1. [X] gras afrijden');
    });
    it('biedt dezelfde vier functies als de todo-lijst met strings', async () => {
        expect((await runProgram(3)).menus[0].items).toEqual(['Add a task', 'Show tasks', 'Check a task', 'Exit']);
    });
});
