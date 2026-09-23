export function addTodo(todos: string[], task: string): void {
    todos.push(task);
}

export function removeTodo(todos: string[], index: number): void {
    if (index < 0 || index >= todos.length) {
        throw new Error('Invalid todo index');
    }
    todos.splice(index, 1);
}

export function countTodos(todos: string[]): number {
    return todos.length;
}

export function clearTodos(todos: string[]): void {
    todos.splice(0, todos.length);
}
