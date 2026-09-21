import { describe, expect, test } from "vitest";
import { add, subtract, multiply, divide } from './math.ts';

describe('math operations', () => {
    test('adds two numbers', () => {
        expect(add(1, 2)).toBe(3);
        expect(add(-1, 2)).toBe(1);
        expect(add(-1, -2)).toBe(-3);
    });

    test('subtracts second number from first', () => {
        expect(subtract(2, 1)).toBe(1);
        expect(subtract(2, -1)).toBe(3);
        expect(subtract(-1, -2)).toBe(1);
    });

    test('multiplies two numbers', () => {
        expect(multiply(2, 3)).toBe(6);
        expect(multiply(-1, 2)).toBe(-2);
        expect(multiply(-1, -2)).toBe(2);
    });

    test('divides first number by second', () => {
        expect(divide(4, 2)).toBe(2);
        expect(divide(4, -2)).toBe(-2);
        expect(divide(-4, -2)).toBe(2);
    });

    test('throws error when dividing by zero', () => {
        expect(() => divide(4, 0)).toThrow("Cannot divide by zero");
    });

    test('throws error when arguments are not numbers', () => {
        expect(() => add(4, NaN)).toThrow("Arguments must be numbers");
        expect(() => subtract(4, NaN)).toThrow("Arguments must be numbers");
        expect(() => multiply(4, NaN)).toThrow("Arguments must be numbers");
        expect(() => divide(4, NaN)).toThrow("Arguments must be numbers");
    })
});
