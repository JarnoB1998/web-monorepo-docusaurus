import readline from 'readline-sync';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [];
let nextId: number = 1;

const menuItems: string[] = [
  "Add a task",
  "Show tasks",
  "Check a task",
  "Exit"
];

async function main() {

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (response.ok) {
      todos = await response.json();
      nextId = Math.max(...todos.map((todo) => todo.id), 0) + 1;

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
          let todoTitles: string[] = [];
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
    } else {
      console.log("Failed to fetch data");
    }
  } catch (e) {
    console.log("Something went wrong fetching data");
  }
}
main();

export { }
