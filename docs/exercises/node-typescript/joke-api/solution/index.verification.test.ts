import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => ({
    selections: [] as number[], confirmations: [] as boolean[], menus: [] as Array<{ items: string[]; prompt: string }>,
    keyInSelect: vi.fn((items: string[], prompt: string) => { terminal.menus.push({ items: [...items], prompt }); return terminal.selections.shift() ?? 0; }),
    keyInYNStrict: vi.fn(() => terminal.confirmations.shift() ?? false)
}));
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

const categories = ['Programming', 'Misc'];
async function runProgram(selections: number[], confirmations: boolean[]) {
    terminal.selections = [...selections]; terminal.confirmations = [...confirmations]; terminal.menus = [];
    const fetchMock = vi.fn((url: string) => {
        if (url.endsWith('/categories')) return Promise.resolve({ json: async () => ({ categories }) });
        if (url.includes('type=twopart')) return Promise.resolve({ json: async () => ({ setup: 'Setup', delivery: 'Delivery' }) });
        return Promise.resolve({ json: async () => ({ joke: 'Single joke' }) });
    });
    vi.stubGlobal('fetch', fetchMock);
    await import('./index.ts');
    await vi.waitFor(() => expect(terminal.keyInYNStrict).toHaveBeenCalledTimes(confirmations.length));
    return { fetchMock, menus: terminal.menus, output: vi.mocked(console.log).mock.calls.map(([value]) => String(value)) };
}

describe('Joke API — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

    it('haalt bij het opstarten eerst de categorieën op', async () => {
        const { fetchMock } = await runProgram([0, 0], [false]);
        expect(fetchMock.mock.calls[0][0]).toBe('https://v2.jokeapi.dev/categories');
    });
    it('gebruikt de opgehaalde categorieën in het keuzemenu', async () => {
        expect((await runProgram([0, 0], [false])).menus[0].items).toEqual(categories);
    });
    it('biedt de types twopart en single aan', async () => {
        expect((await runProgram([0, 0], [false])).menus[1].items).toEqual(['twopart', 'single']);
    });
    it('vraagt een twopart-grap op voor de gekozen categorie', async () => {
        expect((await runProgram([0, 0], [false])).fetchMock).toHaveBeenCalledWith('https://v2.jokeapi.dev/joke/Programming?type=twopart');
    });
    it('toont setup en delivery van een twopart-grap', async () => {
        expect((await runProgram([0, 0], [false])).output).toEqual(expect.arrayContaining(['Setup', 'Delivery']));
    });
    it('vraagt een single-grap op en toont het joke-veld', async () => {
        const result = await runProgram([1, 1], [false]);
        expect(result.fetchMock).toHaveBeenCalledWith('https://v2.jokeapi.dev/joke/Misc?type=single');
        expect(result.output).toContain('Single joke');
    });
    it('vraagt na elke grap of de gebruiker nog een grap wil zien', async () => {
        await runProgram([0, 0], [false]);
        expect(terminal.keyInYNStrict).toHaveBeenCalledWith('Do you want to see another joke?');
    });
    it('herhaalt de volledige keuze wanneer de gebruiker ja antwoordt', async () => {
        const result = await runProgram([0, 0, 1, 1], [true, false]);
        expect(result.fetchMock).toHaveBeenCalledTimes(3);
        expect(result.menus).toHaveLength(4);
    });
});
