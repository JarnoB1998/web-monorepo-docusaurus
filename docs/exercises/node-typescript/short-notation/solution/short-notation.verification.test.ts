import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { numberToString, printStuff, twoDArray } from './short-notation.ts';

describe('Short Notation — verificatie', () => {
    beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));
    afterEach(() => vi.restoreAllMocks());

    it('staat in het vereiste bestand short-notation.ts', () => {
        expect(readFileSync('./short-notation.ts', 'utf8')).toContain('printStuff');
    });
    it('schrijft printStuff als arrow function zonder blok', () => {
        expect(readFileSync('./short-notation.ts', 'utf8')).toMatch(/printStuff\s*=\s*\([^)]*\)\s*[^=]*=>\s*console\.log/);
    });
    it('print de vereiste begroeting en het nummer', () => {
        printStuff(7, 'Andie');
        expect(console.log).toHaveBeenCalledWith('Hello Andie, you are number 7');
    });
    it('schrijft twoDArray als arrow function zonder blok', () => {
        expect(readFileSync('./short-notation.ts', 'utf8')).toMatch(/twoDArray\s*=\s*\([^)]*\)\s*[^=]*=>\s*\[/);
    });
    it('geeft beide strings in een array en in dezelfde volgorde terug', () => {
        expect(twoDArray('eerste', 'tweede')).toEqual(['eerste', 'tweede']);
    });
    it('schrijft numberToString als arrow function zonder blok', () => {
        expect(readFileSync('./short-notation.ts', 'utf8')).toMatch(/numberToString\s*=\s*\([^)]*\)\s*[^=]*=>\s*`/);
    });
    it('zet een positief, negatief en kommagetal om naar tekst', () => {
        expect(numberToString(42)).toBe('42');
        expect(numberToString(-3)).toBe('-3');
        expect(numberToString(1.5)).toBe('1.5');
    });
});
