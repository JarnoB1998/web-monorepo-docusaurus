import readline from 'readline-sync';
import todosJson from "./todos.json" with { type: "json" };

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = todosJson;
let nextId: number = 1;

const menuItems: string[] = [
  "Add a task",
  "Show tasks",
  "Check a task",
  "Exit"
];

let running: boolean = true;
do {
  let option: number = readline.keyInSelect(menuItems, "What do you want to do?", { cancel: false });
  if (option === 0) {
    let title: string = readline.question("Enter a task: ");
    todos.push({ id: nextId++, title: title, completed: false });
  } else if (option === 1) {
    for (let todo of todos) {
        console.log(`${todo.id}. [${todo.completed ? 'X' : ' '}] ${todo.title}`);
    }
  } else if (option === 2) {
    let todoTitles : string[] = [];
    for (let todo of todos) {
        if (!todo.completed) {
            todoTitles.push(todo.title);        
        }
    }
    let taskIndex: number = readline.keyInSelect(todoTitles, "Which task did you complete?", { cancel: false });
    let todoTitle: string = todoTitles[taskIndex];
    for (let todo of todos) {
        if (todo.title === todoTitle) {
            todo.completed = true;
        }
    }
  } else if (option === 3) {
    running = false;
  }
} while (running);

export {}