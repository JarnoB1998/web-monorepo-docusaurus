import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { addTodo, clearTodos, countTodos, removeTodo } from './todo-list.ts';

describe('Todo List Test — verificatie', () => {
    it('addTodo voegt één taak toe aan dezelfde array', () => { const todos: string[] = []; addTodo(todos, 'A'); expect(todos).toEqual(['A']); });
    it('addTodo behoudt eerder toegevoegde taken', () => { const todos = ['A']; addTodo(todos, 'B'); expect(todos).toEqual(['A', 'B']); });
    it('countTodos geeft nul voor een lege lijst', () => expect(countTodos([])).toBe(0));
    it('countTodos geeft het werkelijke aantal taken', () => expect(countTodos(['A', 'B', 'C'])).toBe(3));
    it('removeTodo verwijdert alleen de taak op de opgegeven index', () => { const todos = ['A', 'B', 'C']; removeTodo(todos, 1); expect(todos).toEqual(['A', 'C']); });
    it('removeTodo weigert een negatieve index', () => expect(() => removeTodo(['A'], -1)).toThrow(Error));
    it('removeTodo weigert een index gelijk aan de lengte', () => expect(() => removeTodo(['A'], 1)).toThrow(Error));
    it('removeTodo weigert een index groter dan de lengte', () => expect(() => removeTodo(['A'], 10)).toThrow(Error));
    it('clearTodos maakt de bestaande array volledig leeg', () => { const todos = ['A', 'B']; clearTodos(todos); expect(todos).toEqual([]); });
    it('het oefentestbestand gebruikt beforeEach en test alle vier functies', () => {
        const tests = readFileSync('./todo-list.test.ts', 'utf8');
        expect(tests).toMatch(/from\s+['"]vitest['"]/); expect(tests).toMatch(/beforeEach\s*\(/);
        for (const name of ['addTodo', 'removeTodo', 'countTodos', 'clearTodos']) expect(tests).toMatch(new RegExp(`${name}\\s*\\(`));
        expect(tests).toMatch(/\.toThrow\s*\(/);
    });
});
