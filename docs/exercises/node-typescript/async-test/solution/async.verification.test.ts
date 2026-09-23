import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getStudents } from './async.ts';

describe('Async Test — verificatie', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('getStudents geeft een Promise terug', () => expect(getStudents(1)).toBeInstanceOf(Promise));
    it('geeft studenten met een naam en leeftijd terug', async () => {
        const promise = getStudents(2); await vi.runAllTimersAsync();
        const students = await promise;
        expect(students).toHaveLength(2);
        for (const student of students) expect(student).toEqual({ name: expect.any(String), age: expect.any(Number) });
    });
    it.each([1, 2, 3])('geeft exact %s student(en) terug', async (limit) => {
        const promise = getStudents(limit); await vi.runAllTimersAsync(); expect(await promise).toHaveLength(limit);
    });
    it('geeft een lege lijst voor limiet nul', async () => {
        const promise = getStudents(0); await vi.runAllTimersAsync(); await expect(promise).resolves.toEqual([]);
    });
    it('wijst een negatieve limiet af met een Error', async () => {
        await expect(getStudents(-1)).rejects.toThrow('Limit must be a positive number');
    });
    it('lost een geldige aanvraag pas na 1000 ms op', async () => {
        const promise = getStudents(1); let settled = false; promise.finally(() => { settled = true; });
        await vi.advanceTimersByTimeAsync(999); expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1); await promise; expect(settled).toBe(true);
    });
    it('async.test.ts gebruikt Vitest en test de gevraagde successcenario’s', () => {
        const tests = readFileSync('./async.test.ts', 'utf8');
        expect(tests).toMatch(/from\s+['"]vitest['"]/); expect(tests).toMatch(/getStudents\s*\(\s*0\s*\)/);
        expect(tests).toMatch(/\.toHaveLength\s*\(|\.length\s*\)\.toBe\s*\(/);
    });
    it('async.test.ts wacht op en controleert de afwijzing voor een negatieve limiet', () => {
        const tests = readFileSync('./async.test.ts', 'utf8');
        expect(tests).toMatch(/await\s+expect\s*\(\s*getStudents\s*\(\s*-\d+\s*\)\s*\)\.rejects\.toThrow/);
    });
    it('async.test.ts controleert de wachttijd van één seconde', () => {
        const tests = readFileSync('./async.test.ts', 'utf8');
        expect(tests).toMatch(/1000/); expect(tests).toMatch(/Date\.now|advanceTimersByTime|runAllTimers/);
    });
});
