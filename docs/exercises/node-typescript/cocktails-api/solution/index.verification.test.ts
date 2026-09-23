import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => ({ answers: [] as string[], question: vi.fn(() => terminal.answers.shift() ?? '') }));
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

const cocktailData: Record<string, string[]> = {
    Kiwi: ['Kiwi Lemon', 'Kiwi Martini'],
    lemon: ['Gin Lemon', 'Lemon Drop']
};

async function runProgram(answers: string[]) {
    terminal.answers = [...answers];
    const fetchMock = vi.fn((url: string) => {
        const ingredient = new URL(url).searchParams.get('s') ?? '';
        return Promise.resolve({ json: async () => ({ drinks: (cocktailData[ingredient] ?? []).map((strDrink, id) => ({ idDrink: String(id), strDrink })) }) });
    });
    vi.stubGlobal('fetch', fetchMock);
    await import('./index.ts');
    await vi.waitFor(() => expect(terminal.question).toHaveBeenCalledTimes(answers.length));
    return { fetchMock, output: vi.mocked(console.log).mock.calls.map(([value]) => String(value)) };
}

describe('Cocktail API — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

    it('toont de welkomstbanner', async () => {
        expect((await runProgram([''])).output.slice(0, 3)).toEqual([
            '-------------------------------------------', '| Welcome to the cocktail lookup service. |', '-------------------------------------------'
        ]);
    });
    it('vraagt de gebruiker om een ingrediënt', async () => {
        await runProgram(['']);
        expect(terminal.question).toHaveBeenCalledWith('Please provide an ingredient: ');
    });
    it('stopt bij een lege invoer zonder een API-aanvraag te doen', async () => {
        expect((await runProgram([''])).fetchMock).not.toHaveBeenCalled();
    });
    it('vraagt cocktails op via de opgegeven zoek-URL', async () => {
        expect((await runProgram(['Kiwi', ''])).fetchMock).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Kiwi');
    });
    it('toont een titel met het gekozen ingrediënt', async () => {
        expect((await runProgram(['Kiwi', ''])).output).toContain('Cocktails with Kiwi:');
    });
    it('toont elke gevonden cocktail op een aparte regel', async () => {
        const output = (await runProgram(['Kiwi', ''])).output;
        expect(output).toContain('- Kiwi Lemon'); expect(output).toContain('- Kiwi Martini');
    });
    it('blijft ingrediënten opvragen totdat de gebruiker leeg invoert', async () => {
        const result = await runProgram(['Kiwi', 'lemon', '']);
        expect(result.fetchMock).toHaveBeenCalledTimes(2);
        expect(result.output).toEqual(expect.arrayContaining(['Cocktails with Kiwi:', 'Cocktails with lemon:', '- Lemon Drop']));
    });
});
