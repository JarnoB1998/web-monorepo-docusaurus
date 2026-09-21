import readline from 'readline-sync';

const tasks: string[] = [];
const checkedTasks: string[] = [];

const menuItems : string[] = [
    "Add a task",
    "Show tasks",
    "Check a task",
    "Exit"
];

let running: boolean = true;
do {
let option : number = readline.keyInSelect(menuItems, "What do you want to do?", {cancel: false});

if (option === 0) {
    let task: string = readline.question("Enter a task: ");
    tasks.push(task);
} else if (option === 1) {
    for (let i = 0; i < tasks.length; i++) {
        console.log(`${i + 1}. [ ] ${tasks[i]}`);
    }
    for (let i = 0; i < checkedTasks.length; i++) {
        console.log(`${i + 1}. [X] ${checkedTasks[i]}`);
    }
} else if (option === 2) {
    let taskIndex: number = readline.keyInSelect(tasks, "What did you do?", { cancel: false });
    checkedTasks.push(tasks[taskIndex]);
    tasks.splice(taskIndex, 1);
} else if (option === 3) {
    running = false;
}
} while (running);




export {}
