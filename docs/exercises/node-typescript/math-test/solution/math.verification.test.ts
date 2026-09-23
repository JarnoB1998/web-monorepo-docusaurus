import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { add, divide, multiply, subtract } from './math.ts';

describe('Math Test — verificatie', () => {
    it('add telt twee getallen op', () => expect(add(-1, 2)).toBe(1));
    it('subtract trekt het tweede getal van het eerste af', () => expect(subtract(2, -1)).toBe(3));
    it('multiply vermenigvuldigt twee getallen', () => expect(multiply(-2, -3)).toBe(6));
    it('divide deelt het eerste getal door het tweede', () => expect(divide(7, 2)).toBe(3.5));
    it('divide gooit bij een nul als tweede argument', () => expect(() => divide(4, 0)).toThrow(Error));
    it.each([
        ['add', add], ['subtract', subtract], ['multiply', multiply], ['divide', divide]
    ] as const)('%s gooit als het eerste argument NaN is', (_name, operation) => expect(() => operation(NaN, 2)).toThrow(Error));
    it.each([
        ['add', add], ['subtract', subtract], ['multiply', multiply], ['divide', divide]
    ] as const)('%s gooit als het tweede argument NaN is', (_name, operation) => expect(() => operation(2, NaN)).toThrow(Error));
    it('math.test.ts gebruikt Vitest en test elke functie', () => {
        const tests = readFileSync('./math.test.ts', 'utf8');
        expect(tests).toMatch(/from\s+['"]vitest['"]/);
        for (const name of ['add', 'subtract', 'multiply', 'divide']) expect(tests).toMatch(new RegExp(`${name}\\s*\\(`));
    });
    it('math.test.ts controleert deling door nul', () => {
        const tests = readFileSync('./math.test.ts', 'utf8');
        expect(tests).toMatch(/divide\s*\([^)]*,\s*0\s*\)/); expect(tests).toMatch(/\.toThrow\s*\(/);
    });
    it('math.test.ts controleert NaN voor alle vier functies', () => {
        const tests = readFileSync('./math.test.ts', 'utf8');
        for (const name of ['add', 'subtract', 'multiply', 'divide']) {
            expect(tests).toMatch(new RegExp(`${name}\\s*\\([^)]*NaN`));
        }
    });
});
