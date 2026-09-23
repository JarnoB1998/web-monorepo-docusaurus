import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => ({
    selections: [] as number[], confirmations: [] as boolean[], menus: [] as Array<{ items: string[]; prompt: string }>,
    keyInSelect: vi.fn((items: string[], prompt: string) => { terminal.menus.push({ items: [...items], prompt }); return terminal.selections.shift() ?? -1; }),
    keyInYNStrict: vi.fn(() => terminal.confirmations.shift() ?? false)
}));
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

const countries = ['France', 'Netherlands', 'United Kingdom', 'Belgium', 'luxembourg', 'Ireland', 'Spain', 'Portugal'];
async function runProgram(selections: number[], confirmations: boolean[] = []) {
    terminal.selections = [...selections]; terminal.confirmations = [...confirmations]; terminal.menus = [];
    const fetchMock = vi.fn((url: string) => {
        const country = new URL(url).searchParams.get('country') ?? '';
        return Promise.resolve({ json: async () => [{ name: `${country} University` }, { name: `${country} College` }] });
    });
    vi.stubGlobal('fetch', fetchMock);
    await import('./index.ts');
    if (selections[0] === -1) await vi.waitFor(() => expect(terminal.keyInSelect).toHaveBeenCalled());
    else await vi.waitFor(() => expect(terminal.keyInYNStrict).toHaveBeenCalledTimes(confirmations.length));
    return { fetchMock, menus: terminal.menus, output: vi.mocked(console.log).mock.calls.map(([value]) => String(value)) };
}

describe('School API — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

    it('biedt alle acht opgegeven landen aan', async () => {
        expect((await runProgram([-1])).menus[0].items).toEqual(countries);
    });
    it('stopt bij Cancel zonder een API-aanvraag te doen', async () => {
        expect((await runProgram([-1])).fetchMock).not.toHaveBeenCalled();
    });
    it('vraagt de scholen van het gekozen land op', async () => {
        expect((await runProgram([1], [false])).fetchMock).toHaveBeenCalledWith('http://universities.hipolabs.com/search?country=Netherlands');
    });
    it('URL-encodeert landnamen met spaties', async () => {
        expect((await runProgram([2], [false])).fetchMock).toHaveBeenCalledWith('http://universities.hipolabs.com/search?country=United%20Kingdom');
    });
    it('toont een titel voor het gekozen land', async () => {
        expect((await runProgram([1], [false])).output).toContain('Colleges in Netherlands:');
    });
    it('toont de naam van elke gevonden school', async () => {
        const output = (await runProgram([1], [false])).output;
        expect(output).toContain('Netherlands University'); expect(output).toContain('Netherlands College');
    });
    it('vraagt na de resultaten of de gebruiker nog een land wil opzoeken', async () => {
        await runProgram([1], [false]);
        expect(terminal.keyInYNStrict).toHaveBeenCalledWith('Do you want to look up another country?');
    });
    it('toont opnieuw het landenmenu als de gebruiker ja antwoordt', async () => {
        const result = await runProgram([0, 7], [true, false]);
        expect(result.menus).toHaveLength(2); expect(result.fetchMock).toHaveBeenCalledTimes(2);
    });
});
