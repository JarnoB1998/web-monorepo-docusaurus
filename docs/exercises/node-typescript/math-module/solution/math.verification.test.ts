import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { add, divide, multiply, power, subtract } from './math.ts';

describe('Math Module — verificatie', () => {
    beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));
    afterEach(() => { vi.restoreAllMocks(); vi.resetModules(); });

    it('add telt twee getallen op', () => expect(add(2, 3)).toBe(5));
    it('subtract trekt het tweede getal van het eerste af', () => expect(subtract(2, 5)).toBe(-3));
    it('multiply vermenigvuldigt twee getallen', () => expect(multiply(-2, 5)).toBe(-10));
    it('divide deelt het eerste getal door het tweede', () => expect(divide(7, 2)).toBe(3.5));
    it('divide gooit de juiste Error bij deling door nul', () => expect(() => divide(10, 0)).toThrow('Cannot divide by zero'));
    it('power verheft het eerste getal tot de macht van het tweede', () => expect(power(2, 3)).toBe(8));
    it('power geeft 1 voor exponent nul', () => expect(power(99, 0)).toBe(1));
    it('index.ts importeert, gebruikt en toont het resultaat van elke functie', async () => {
        await import('./index.ts');
        expect(vi.mocked(console.log).mock.calls.map(([value]) => value)).toEqual([3, -1, 2, 0.5, 8]);
    });
    it('math.test.ts bevat aparte describe-blocks en alle gevraagde randgevallen', () => {
        const tests = readFileSync('./math.test.ts', 'utf8');
        for (const name of ['add', 'subtract', 'multiply', 'divide', 'power']) {
            expect(tests).toMatch(new RegExp(`describe\\s*\\(\\s*['\"]${name}['\"]`));
        }
        expect(tests).toMatch(/add\s*\(\s*-\d+/); expect(tests).toMatch(/add\s*\([^)]*0\s*\)/);
        expect(tests).toMatch(/subtract\s*\(\s*2\s*,\s*5\s*\)/); expect(tests).toMatch(/multiply\s*\([^)]*0\s*\)/);
        expect(tests).toMatch(/divide\s*\([^)]*,\s*0\s*\)/); expect(tests).toMatch(/\.toThrow\s*\(/);
        expect(tests).toMatch(/power\s*\([^)]*,\s*0\s*\)/);
    });
});
