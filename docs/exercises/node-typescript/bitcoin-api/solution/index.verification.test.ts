import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answer: string; prompts: string[] } = { answer: '', prompts: [] };
    const question = vi.fn((prompt: string) => { state.prompts.push(prompt); return state.answer; });
    return { state, question };
});
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

const apiData = {
    bpi: {
        EUR: { code: 'EUR', rate_float: 47595.1855 },
        USD: { code: 'USD', rate_float: 51547.13 },
        GBP: { code: 'GBP', rate_float: 40663.6065 }
    }
};

async function runProgram(currency: string) {
    terminal.state.answer = currency; terminal.state.prompts = [];
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => apiData });
    vi.stubGlobal('fetch', fetchMock);
    await import('./index.ts');
    await vi.waitFor(() => expect(console.log).toHaveBeenCalled());
    return { fetchMock, prompts: terminal.state.prompts, output: vi.mocked(console.log).mock.calls.map(([x]) => String(x)) };
}

describe('Bitcoin API — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

    it('vraagt om EUR, USD of GBP', async () => {
        expect((await runProgram('USD')).prompts).toEqual(['Welke valuta wil je zien? (EUR, USD, GBP): ']);
    });
    it('haalt de prijs op via de opgegeven Bitcoin-API', async () => {
        expect((await runProgram('USD')).fetchMock).toHaveBeenCalledWith('https://sampleapis.assimilate.be/bitcoin/current');
    });
    it.each([
        ['EUR', 'De huidige prijs van bitcoin is 47595.1855 EUR'],
        ['USD', 'De huidige prijs van bitcoin is 51547.13 USD'],
        ['GBP', 'De huidige prijs van bitcoin is 40663.6065 GBP']
    ])('toont de prijs voor %s', async (currency, expected) => {
        expect((await runProgram(currency)).output).toEqual([expected]);
    });
    it('weigert een niet-ondersteunde valuta met feedback', async () => {
        expect((await runProgram('JPY')).output).toEqual(['Deze valuta wordt niet ondersteund']);
    });
    it('doet geen API-aanroep voor een niet-ondersteunde valuta', async () => {
        expect((await runProgram('JPY')).fetchMock).not.toHaveBeenCalled();
    });
});
