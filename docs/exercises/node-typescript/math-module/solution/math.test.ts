import { describe, expect, test } from "vitest";
import { add, subtract, multiply, divide, power } from './math.ts';

describe('add', () => {
    test('should return the sum of two positive numbers', () => {
        expect(add(2, 3)).toBe(5);
        expect(add(10, 20)).toBe(30);
    });

    test('should return the correct result when adding a negative number', () => {
        expect(add(-2, 3)).toBe(1);
        expect(add(5, -5)).toBe(0);
    });

    test('should return the same number when adding zero', () => {
        expect(add(7, 0)).toBe(7);
    });
});

describe('subtract', () => {
    test('should return the difference of two numbers', () => {
        expect(subtract(10, 4)).toBe(6);
        expect(subtract(3, 3)).toBe(0);
    });

    test('should return a negative result when subtracting a larger number', () => {
        expect(subtract(2, 5)).toBe(-3);
    });
});

describe('multiply', () => {
    test('should return the product of two numbers', () => {
        expect(multiply(3, 4)).toBe(12);
        expect(multiply(-2, 5)).toBe(-10);
    });

    test('should return zero when multiplying by zero', () => {
        expect(multiply(100, 0)).toBe(0);
    });
});

describe('divide', () => {
    test('should return the correct result of a division', () => {
        expect(divide(10, 2)).toBe(5);
        expect(divide(7, 2)).toBe(3.5);
    });

    test('should throw an error when dividing by zero', () => {
        expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
});

describe('power', () => {
    test('should return the correct power of a number', () => {
        expect(power(2, 3)).toBe(8);
        expect(power(5, 2)).toBe(25);
    });

    test('should return 1 when the exponent is zero', () => {
        expect(power(99, 0)).toBe(1);
    });
});
