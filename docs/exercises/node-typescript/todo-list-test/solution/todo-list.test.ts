import { beforeEach, describe, expect, test } from 'vitest';
import { addTodo, clearTodos, countTodos, removeTodo } from './todo-list.ts';

describe('todo list', () => {
    let todos: string[];

    beforeEach(() => { todos = []; });

    test('adds one task', () => { addTodo(todos, 'TypeScript oefenen'); expect(todos).toEqual(['TypeScript oefenen']); });
    test('adds multiple tasks', () => { addTodo(todos, 'A'); addTodo(todos, 'B'); expect(todos).toEqual(['A', 'B']); });
    test('counts tasks', () => { addTodo(todos, 'A'); addTodo(todos, 'B'); expect(countTodos(todos)).toBe(2); });
    test('removes the task at the given index', () => { todos.push('A', 'B', 'C'); removeTodo(todos, 1); expect(todos).toEqual(['A', 'C']); });
    test.each([-1, 1])('rejects invalid index %s', (index) => expect(() => removeTodo(todos, index)).toThrow(Error));
    test('clears all tasks', () => { todos.push('A', 'B'); clearTodos(todos); expect(todos).toEqual([]); });
});
