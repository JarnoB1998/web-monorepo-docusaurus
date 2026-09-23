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

const initialTodos = [
    { id: 4, title: 'typescript oefenen', completed: true },
    { id: 9, title: 'fotoalbum maken', completed: false }
];

async function runProgram(answers: unknown[], response: { ok: boolean; json(): Promise<unknown> } | Error = { ok: true, json: async () => structuredClone(initialTodos) }) {
    terminal.state.answers = [...answers]; terminal.state.menus = [];
    const fetchMock = response instanceof Error ? vi.fn().mockRejectedValue(response) : vi.fn().mockResolvedValue(response);
    vi.stubGlobal('fetch', fetchMock);
    await import('./index.ts');
    await vi.waitFor(() => expect(console.log).toHaveBeenCalled());
    return { fetchMock, menus: terminal.state.menus, output: vi.mocked(console.log).mock.calls.map(([x]) => String(x)) };
}

describe('Todo List Fetch — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

    it('haalt de begintaken op via de opgegeven URL', async () => {
        expect((await runProgram([1, 3])).fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos');
    });
    it('toont opgehaalde taken met id en status', async () => {
        const output = (await runProgram([1, 3])).output;
        expect(output).toContain('4. [X] typescript oefenen');
        expect(output).toContain('9. [ ] fotoalbum maken');
    });
    it('biedt dezelfde vier todo-functies aan', async () => {
        expect((await runProgram([1, 3])).menus[0].items).toEqual(['Add a task', 'Show tasks', 'Check a task', 'Exit']);
    });
    it('voegt een nieuwe taak toe met het volgende vrije id', async () => {
        const output = (await runProgram([0, 'nieuwe taak', 1, 3])).output;
        expect(output).toContain('10. [ ] nieuwe taak');
    });
    it('laat alleen onafgewerkte taken kiezen om af te vinken', async () => {
        const result = await runProgram([2, 0, 1, 3]);
        expect(result.menus[1].items).toEqual(['fotoalbum maken']);
    });
    it('markeert de gekozen taak als afgewerkt', async () => {
        expect((await runProgram([2, 0, 1, 3])).output).toContain('9. [X] fotoalbum maken');
    });
    it('geeft feedback bij een niet-succesvolle HTTP-response', async () => {
        const result = await runProgram([], { ok: false, json: async () => { throw new Error('mag niet aangeroepen worden'); } });
        expect(result.output).toContain('Failed to fetch data');
    });
    it('geeft feedback als de fetch-aanroep zelf mislukt', async () => {
        expect((await runProgram([], new Error('network'))).output).toContain('Something went wrong fetching data');
    });
});
