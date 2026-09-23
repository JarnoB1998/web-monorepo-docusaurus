import { describe, expect, test } from 'vitest';
import { validateAge, validateUsername } from './validator.ts';

describe('validateAge', () => {
    test('accepts a valid age', () => expect(() => validateAge(25)).not.toThrow());
    test.each([0, -1])('rejects age %s', (age) => expect(() => validateAge(age)).toThrow(Error));
    test('rejects ages above 150', () => expect(() => validateAge(151)).toThrow(Error));
});

describe('validateUsername', () => {
    test('accepts a valid username', () => expect(() => validateUsername('alice')).not.toThrow());
    test('rejects usernames shorter than 3 characters', () => expect(() => validateUsername('ab')).toThrow(Error));
    test('rejects usernames longer than 20 characters', () => expect(() => validateUsername('a'.repeat(21))).toThrow(Error));
});
