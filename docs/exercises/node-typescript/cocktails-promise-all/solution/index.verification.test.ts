import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const drinks = new Map([
    ['11000', 'Mojito'], ['11001', 'Old Fashioned'], ['11002', 'Long Island Tea']
]);

async function runProgram() {
    const fetchMock = vi.fn((url: string) => {
        const id = new URL(url).searchParams.get('i') ?? '';
        return Promise.resolve({ json: async () => ({ drinks: [{ idDrink: id, strDrink: drinks.get(id) }] }) });
    });
    vi.stubGlobal('fetch', fetchMock);
    await import('./index.ts');
    await vi.waitFor(() => expect(console.log).toHaveBeenCalledTimes(3));
    return fetchMock;
}

describe('Cocktails Promise All — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

    it('gebruikt Promise.all om de aanvragen samen af te handelen', () => {
        expect(readFileSync('./index.ts', 'utf8')).toMatch(/Promise\.all\s*\(/);
    });
    it.each(['11000', '11001', '11002'])('vraagt cocktail %s op via de opgegeven endpoint', async (id) => {
        const fetchMock = await runProgram();
        expect(fetchMock).toHaveBeenCalledWith(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    });
    it('start alle drie de aanvragen voordat de antwoorden verwerkt zijn', async () => {
        const resolvers: Array<(value: { json(): Promise<unknown> }) => void> = [];
        const fetchMock = vi.fn(() => new Promise<{ json(): Promise<unknown> }>((resolve) => resolvers.push(resolve)));
        vi.stubGlobal('fetch', fetchMock);
        await import('./index.ts');
        expect(fetchMock).toHaveBeenCalledTimes(3);
        resolvers.forEach((resolve, index) => resolve({ json: async () => ({ drinks: [{ strDrink: `drink ${index}` }] }) }));
        await vi.waitFor(() => expect(console.log).toHaveBeenCalledTimes(3));
    });
    it('toont de namen van de drie cocktails in de gevraagde volgorde', async () => {
        await runProgram();
        expect(vi.mocked(console.log).mock.calls.map(([value]) => value)).toEqual(['Mojito', 'Old Fashioned', 'Long Island Tea']);
    });
});
