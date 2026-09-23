import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateAge, validateUsername } from './validator.ts';

describe('Exceptions Test — verificatie', () => {
    it.each([1, 25, 150])('validateAge aanvaardt geldige leeftijd %s', (age) => expect(() => validateAge(age)).not.toThrow());
    it.each([0, -1, -100])('validateAge weigert leeftijd %s', (age) => expect(() => validateAge(age)).toThrow(Error));
    it.each([151, 200])('validateAge weigert leeftijd %s boven 150', (age) => expect(() => validateAge(age)).toThrow(Error));
    it.each(['abc', 'alice', 'a'.repeat(20)])('validateUsername aanvaardt geldige gebruikersnaam van lengte %s', (username) => expect(() => validateUsername(username)).not.toThrow());
    it.each(['', 'a', 'ab'])('validateUsername weigert te korte gebruikersnaam van lengte %s', (username) => expect(() => validateUsername(username)).toThrow(Error));
    it('validateUsername weigert een gebruikersnaam langer dan 20 tekens', () => expect(() => validateUsername('a'.repeat(21))).toThrow(Error));
    it('bevat een afzonderlijk Vitest-bestand met tests voor beide functies', () => {
        const tests = readFileSync('./validator.test.ts', 'utf8');
        expect(tests).toMatch(/from\s+['"]vitest['"]/);
        expect(tests).toMatch(/validateAge\s*\(/); expect(tests).toMatch(/validateUsername\s*\(/);
        expect(tests).toMatch(/\.not\.toThrow\s*\(/); expect(tests).toMatch(/\.toThrow\s*\(/);
    });
});
