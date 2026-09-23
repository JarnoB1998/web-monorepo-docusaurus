import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const terminal = vi.hoisted(() => {
    const state: { answer: string; prompts: string[] } = { answer: '', prompts: [] };
    const question = vi.fn((prompt: string) => { state.prompts.push(prompt); return state.answer; });
    return { state, question };
});
vi.mock('readline-sync', () => ({ default: terminal, ...terminal }));

async function runProgram(timestamp: string) {
    terminal.state.answer = timestamp; terminal.state.prompts = [];
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => '2019-02-11 13:38:00' });
    vi.stubGlobal('fetch', fetchMock);
    await import('./index.ts');
    await vi.waitFor(() => expect(console.log).toHaveBeenCalled());
    return { fetchMock, prompts: terminal.state.prompts, output: vi.mocked(console.log).mock.calls.map(([x]) => String(x)) };
}

describe('Unix Timestamp API — verificatie', () => {
    beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
    afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

    it('vraagt een Unix timestamp', async () => { expect((await runProgram('1549892280')).prompts).toHaveLength(1); });
    it('voegt de timestamp toe aan de opgegeven API-URL', async () => {
        expect((await runProgram('1549892280')).fetchMock).toHaveBeenCalledWith('https://helloacm.com/api/unix-timestamp-converter/?cached&s=1549892280');
    });
    it('leest het antwoord als JSON', async () => {
        const json = vi.fn().mockResolvedValue('2019-02-11 13:38:00');
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json }));
        terminal.state.answer = '1549892280';
        await import('./index.ts');
        await vi.waitFor(() => expect(json).toHaveBeenCalled());
    });
    it('toont zowel de oorspronkelijke timestamp als de leesbare tijd', async () => {
        expect((await runProgram('1549892280')).output).toEqual([
            'De unix timestamp 1549892280 omgezet naar ons tijdsformaat is gelijk aan 2019-02-11 13:38:00'
        ]);
    });
});
